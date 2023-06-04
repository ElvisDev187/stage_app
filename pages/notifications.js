import Layout from "../components/Layout";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";


export default function NotificationsPage() {
  const session = useSession()
  const [profile,setProfile] = useState(null);
  const supabase = useSupabaseClient()

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase.from('profiles')
      .select()
      .eq('id', session.user.id)
      .then(result => {
        if (result.data.length) {
          setProfile(result.data[0]);
        }
      })
  }, [session?.user?.id, supabase]);
const notifications = supabase.channel('custom-insert-channel')
.on(
  'postgres_changes', 
  { event: 'INSERT', schema: 'public', table: 'notifications' },
  (payload) => {
    console.log('Change received!', payload)
    fectNotifications()
  }
)
.subscribe()
function fectNotifications(){
  supabase.from('notifications')
  .select('*')
  .eq('author', profile?.id)
  .then(result=>{
      console.log("LENGTH",result.data?.length);
  })
}
  return (
    <Layout>
      <h1 className="text-6xl mb-4 text-gray-300">Notifications</h1>
      <Card noPadding={true}>
        <div className="">
          <div className="flex gap-2 items-center border-b border-b-gray-100 p-4">
            <Link href={'/profile'}>
              <Avatar />
            </Link>
            <div>
              <Link href={'/profile'} className={'font-semibold mr-1 hover:underline'}>John Doe</Link>
              liked
              <Link href={''} className={'ml-1 text-socialBlue hover:underline'}>your photo</Link>
            </div>
          </div>
          <div className="flex gap-2 items-center border-b border-b-gray-100 p-4">
            <Link href={'/profile'}>
              <Avatar />
            </Link>
            <div>
              <Link href={'/profile'} className={'font-semibold mr-1 hover:underline'}>John Doe</Link>
              liked
              <Link href={''} className={'ml-1 text-socialBlue hover:underline'}>your photo</Link>
            </div>
          </div>
          <div className="flex gap-2 items-center border-b border-b-gray-100 p-4">
            <Link href={'/profile'}>
              <Avatar />
            </Link>
            <div>
              <Link href={'/profile'} className={'font-semibold mr-1 hover:underline'}>John Doe</Link>
              liked
              <Link href={''} className={'ml-1 text-socialBlue hover:underline'}>your photo</Link>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}