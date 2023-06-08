import Layout from "../components/Layout";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ReactTimeAgo from "react-time-ago";


export default function NotificationsPage() {

  const { profile, setNotif } = useContext(UserContext)
  const supabase = useSupabaseClient()
  const client = useQueryClient()
  const notificationsChannel = supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      async (payload) => {
        console.log('Change received!', payload)
        await client.invalidateQueries("notifications")
      }
    )
    .subscribe()

  // use to fetch number

  // supabase.from('notifications')
  //   .select('*')
  //   .eq('author', profile?.id)
  //   .then(result=>{
  //       console.log("LENGTH",result.data?.length);
  //   })


  async function fechtNotifications(nextPage, pageSize) {
    return supabase.from('notifications')
      .select('id,created_at,type,post_id,profiles(name,avatar,id)')
      .eq('author', profile?.id)
      .eq("isRead", false)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)
  }


  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useInfiniteQuery(
    ['notifications'],
    async ({ pageParam = 0 }) => {
      const res = await fechtNotifications(pageParam, 5)
      return res.data
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // console.log({ lastPage, allPages });
        if (lastPage?.length === 3) {
          return allPages.length // Retourne le numéro de page suivant
        } else {
          return null // Indique qu'il n'y a plus de pages à récupérer
        }
      },
     

    }
  )

  function markAsread(notifId){
    supabase.from("notifications")
    .update({
      isRead: true
    })
    .eq('id', notifId)
    .then(async (res)=>{
     await client.invalidateQueries("notifications")
     setNotif(prev=> prev--);
    })
  }

  const notifications = data?.pages.flatMap((page) => page)

  if (status === "loading") {
    return <h1>Loading ...</h1>
  }


  return (
    <Layout hideNavigation={false}>
      <h1 className="text-6xl mb-4 text-gray-300">Notifications</h1>
      <Card noPadding={true}>
        <div className="">
          {notifications?.length > 0 && notifications.map(notification => (
            <div key={notification?.id} className="flex gap-2 items-center border-b border-b-gray-100 p-4 relative">
              <Link href={'/profile'}>
                <Avatar url={notification?.profiles?.avatar} />
              </Link>
              <div>
                <Link href={`/profile/${notification?.profiles?.id}`} className={'font-semibold mr-1 hover:underline'}>{notification?.profiles?.name}</Link>
                {notification?.type}
                <Link href={`/post/${notification?.post_id}`} className={'ml-1 text-socialBlue hover:underline'}>your Post</Link>
              </div>

              <p className="text-gray-400 text-sm font-semibold">
                <ReactTimeAgo date={(new Date(notification?.created_at)).getTime() || (new Date(Date.now()).getTime())} />
              </p>
              <button className="absolute right-5" onClick={() =>markAsread(notification?.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}