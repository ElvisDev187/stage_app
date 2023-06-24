import Layout from "../components/Layout";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import ReactTimeAgo from "react-time-ago";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";
import { BellOff, FolderOpen } from "lucide-react";

export default function NotificationsPage() {

  const { profile, setNotif, audioRef } = useContext(UserContext)
  const supabase = useSupabaseClient()


  const notificationsChannel = supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      async (payload) => {
        if (payload.new?.author == profile?.id) {

          refetch().then(() => audioRef?.current?.play())
        }

      }
    )
    .subscribe()




  async function fechtNotifications(nextPage, pageSize) {
    return supabase.from('notifications')
      .select('id,created_at,type,post_id,profiles(name,avatar,id)')
      .eq('author', profile?.id)
      .eq("isRead", false)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)
  }


  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, isError, refetch } = useInfiniteQuery(
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

  function markAsread(notifId) {
    supabase.from("notifications")
      .update({
        isRead: true
      })
      .eq('id', notifId)
      .then(async (res) => {
        refetch()
        setNotif(prev => prev--);
      })
  }

  const notifications = data?.pages.flatMap((page) => page)



  return (
    <Layout hideNavigation={false}>
      <Head>
        <title>EcoShip | Notifications</title>
      </Head>
      <h1 className="text-6xl mb-4 text-gray-300">Notifications</h1>
      <Card noPadding={true}>
        <div className="mb-1">
          {
            isLoading ?
              <div className='flex flex-col gap-4 justify-center items-center w-full h-full bg-gray-50 '>
                {Array.from({ length: 5 }).map((v, i) => (<Skeleton key={i} className='w-full h-10 my-2' />))}
              </div>

              :
              <>
                {notifications?.length > 0 && notifications ? notifications.map(notification => {
                  if (notification.type == "comment") {
                    return (
                      <div key={notification?.id} className="flex gap-2 md:flex-nowrap sm:flex-wrap items-center border-b border-b-gray-100 p-4 relative">
                        <Link href={`/profile/${notification?.profiles?.id}`} onClick={() => markAsread(notification?.id)}>
                          <Avatar url={notification?.profiles?.avatar} />
                        </Link>
                        <div>
                          <Link href={`/profile/${notification?.profiles?.id}`} onClick={() => markAsread(notification?.id)} className={'font-semibold mr-1 hover:underline'}>{notification?.profiles?.name}</Link>
                          {notification?.type}
                          <Link href={`/post/${notification?.post_id}`} onClick={() => markAsread(notification?.id)} className={'ml-1 text-socialBlue hover:underline'}>your Post</Link>
                        </div>

                        <p className="text-gray-400 text-sm font-semibold">
                          <ReactTimeAgo date={(new Date(notification?.created_at)).getTime() || (new Date(Date.now()).getTime())} />
                        </p>
                        <button className="absolute right-5" onClick={() => markAsread(notification?.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                    )
                  } else {
                    return (
                      <div key={notification?.id} className="flex gap-2 md:flex-nowrap sm:flex-wrap items-center border-b border-b-gray-100 p-4 relative">
                        <span className="text-zinc-700 font-medium">
                          You receive warning du to your post content
                        </span>

                        <p className="text-gray-400 text-sm font-semibold">
                          <ReactTimeAgo date={(new Date(notification?.created_at)).getTime() || (new Date(Date.now()).getTime())} />
                        </p>
                        <button className="absolute right-5" onClick={() => markAsread(notification?.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>)
                  }
                }) :
                  <div className='flex flex-col gap-4 justify-center items-center w-full h-full bg-gray-50 '>
                    <BellOff className='w-14 h-14 text-zinc-400 mt-8' />
                    <h2 className='font-bold text-2xl text-zinc-600 mb-8'>You Dont Have Notifications</h2>
                  </div>
                }
              </>
          }
        </div>
      </Card>
    </Layout>
  );
}