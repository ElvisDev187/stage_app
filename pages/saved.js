/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { useContext, useEffect, useRef, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "../contexts/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ShimmerSocialPost } from "react-shimmer-effects";
import { useIntersection } from "@mantine/hooks";

export default function SavedPostsPage() {

  const { profile } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const lastPost = useRef(null)

  async function loadSvaed(nextPage, pageSize) {
    return supabase
      .from('saved_posts')
      .select('posts(id, content, created_at, photos, profiles(id, avatar, name))')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)
  }

  const { data, isLoading, isStale, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["savedposts"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await loadSvaed(pageParam, 3)
      return res.data
    },
    // enabled: !!profile,

    getNextPageParam: (lastPage, allPages) => {
      // console.log({ lastPage, allPages });
      if (lastPage?.length === 3) {
        return allPages.length // Retourne le numéro de page suivant
      } else {
        return null // Indique qu'il n'y a plus de pages à récupérer
      }
    },

  })

  const { entry, ref } = useIntersection({
    threshold: 1,
    root: lastPost.current
  })
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) fetchNextPage()
  }, [entry])



  const posts = data?.pages.flatMap((page) => page)
  return (
    <Layout hideNavigation={false}>
      <h1 className="text-6xl mb-4 text-gray-300">Saved posts</h1>
      {
        (isLoading) ?
          <>
            <ShimmerSocialPost type="both" />
            <ShimmerSocialPost type="both" />

          </>
          :
          <div className="max-h-[90vh] overflow-y-scroll overflow-x-hidden">
            {(posts.length > 0) && posts.map((post, index) => {
              if (index + 1 == posts.length) {
                return (
                  <div key={post.posts.id} ref={ref}>
                    <PostCard {...post.posts} />
                  </div>
                )
              } else {
                return (
                  <div key={post.posts.id}>
                    <PostCard {...post.posts} />
                  </div>
                )
              }
            })}
          </div>
      }

    </Layout>
  );
}