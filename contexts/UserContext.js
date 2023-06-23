import {createContext, useEffect, useRef, useState} from "react";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/router";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [profile,setProfile] = useState(null);
  const [notifNumber,setNotif] = useState(0);
  const audioRef = useRef(null)
 const router = useRouter()
  const { toast } = useToast()
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

          if(payload.new?.author == profile?.id){
           console.log(payload.new)

               if (payload.new?.type == "warning") {
                toast({
                  title: "Uh oh! Something went wrong.",
                  description: "There was a problem with your request.",
                  action: <ToastAction onClick={()=> router.push('/notifications')} altText="Try again">See notification</ToastAction>,
                  duration: 5000,
                  variant: "destructive"
                })
               }
          }
      
          supabase.from('notifications')
          .select('*')
          .eq('author', session?.user?.id)
          .eq('isRead', false)
          .then(result => {
            audioRef?.current?.play()
            setNotif(prev=>result.data?.length);
    
          });
        }
      ).subscribe()
  }, [session?.user?.id]);

 
  return (
    <UserContext.Provider value={{profile, notifNumber, setNotif, audioRef}}>
      {children}
      <audio src="/audio/sound1.mp3" ref={audioRef} ></audio>
    </UserContext.Provider>
  );
}