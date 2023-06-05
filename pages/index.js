/* eslint-disable react-hooks/exhaustive-deps */
import PostFormCard from "../components/PostFormCard";
import PostCard from "../components/PostCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";


export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession()



  async function fetchPosts(nextPage, pageSize) {
    return supabase.from('posts')
      .select('id, content, created_at, photos, profiles(id, avatar, name)')
      .is('parent', null)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)

  }

  const { data: posts, fetchNextPage, isFetchingNextPage, hasNextPage, status } = useInfiniteQuery(
    ['posts'],
    async ({ pageParam = 0 }) => {
      const res = await fetchPosts(pageParam, 2)
      console.log(res);
      if (res.data.length > 0) {
        return res.data
      } else {
        return []
      }
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        console.log({ lastPage, allPages });
        if (lastPage.length === 2) {
          return allPages.length // Retourne le numéro de page suivant
        } else {
          return false // Indique qu'il n'y a plus de pages à récupérer
        }
      },

    }
  )

  const lastPostRef = useRef(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry]);

  const _posts = posts?.pages.flatMap((page) => page)

  if (!session) {
    return <LoginPage />
  }
  if (status === "loading") {
    return <h1>Loading...</h1>
  }
  return (
    <>

      <PostFormCard onPost={fetchPosts} />
      {_posts.map((post, i) => {
        if (i === _posts.length - 1) {
          return (
            <div key={post.id} ref={ref}>
              <PostCard key={post.id} {...post} />
            </div>
          )
        } else {
          return (
            <div key={post.id}>
              <PostCard key={post.id} {...post} />
            </div>
          )
        }

      })}
      <div>
        {isFetchingNextPage && 'Loading more...'}
      </div>

    </>
  )
}


