import {createContext, useEffect, useState} from "react";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [profile,setProfile] = useState(null);
  const [notifNumber,setNotif] = useState(0);
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase.from('profiles')
      .select()
      .eq('id', session.user.id)
      .then(result => {
        setProfile(result.data?.[0]);
      });
      supabase.from('notifications')
      .select('*')
      .eq('author', session.user.id)
      .eq('isRead', false)
      .then(result => {
        setNotif(result.data?.length);

      });
      const channel = supabase.channel("notif")
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        async (payload) => {
      
          supabase.from('notifications')
          .select('*')
          .eq('author', session?.user?.id)
          .eq('isRead', false)
          .then(result => {
            setNotif(prev=>result.data?.length);
    
          });
        }
      ).subscribe()
  }, [session?.user?.id]);

 
  return (
    <UserContext.Provider value={{profile, notifNumber, setNotif}}>
      {children}
    </UserContext.Provider>
  );
}