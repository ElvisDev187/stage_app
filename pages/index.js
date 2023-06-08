/* eslint-disable react-hooks/exhaustive-deps */
import PostFormCard from "../components/PostFormCard";
import PostCard from "../components/PostCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";


export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession()
  const client = useQueryClient()


  async function fetchPosts(nextPage, pageSize) {
    return supabase.from('posts')
      .select('id, content, created_at, photos, profiles(id, avatar, name)')
      .is('parent', null)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)

  }

  const { data: posts, fetchNextPage: NextPost, isFetchingNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQuery(
    ['posts'],
    async ({ pageParam = 0 }) => {
      const res = await fetchPosts(pageParam, 2)
     return res.data
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // console.log({ lastPage, allPages });
        if (lastPage?.length === 2) {
          return allPages.length // Retourne le numéro de page suivant
        } else {
          return null // Indique qu'il n'y a plus de pages à récupérer
        }
      },

    }
  )

  const afterPost= async()=>{
     await client.invalidateQueries("posts")
  }

  const lastPostRef = useRef(null)
  const { ref, entry: PostEntry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1.0,
  })

  useEffect(() => {
    if (PostEntry?.isIntersecting && hasNextPage) NextPost()
  }, [PostEntry]);

  const _posts = posts?.pages.flatMap((page) => page)


  if (isLoading || isRefetching) {
    return <h1>Loading...</h1>
  }
  return (
    <>

      <PostFormCard onPost={afterPost} />
      <div className="max-h-[75vh] overflow-y-scroll">
      {_posts.map((post, i) => {
        // console.log(_posts.length,i+1);
        if (i + 1 === _posts.length) {
          return (
            <div key={post.id} ref={ref}>
              {/* {i+1} */}
              <PostCard key={post.id} {...post} />
            </div>
          )
        } else {
          return (
            <div key={post.id}>
              {/* {i+1} */}
              <PostCard key={post.id} {...post} />
            </div>
          )
        }

      })}
      </div>
      <div>
        {isFetchingNextPage && 'Loading more...'}
      </div>

    </>
  )
}


