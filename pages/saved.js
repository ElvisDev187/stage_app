import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import { useContext, useEffect, useState } from "react";
import {  useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "../contexts/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ShimmerSocialPost } from "react-shimmer-effects";

export default function SavedPostsPage() {

  const { profile } = useContext(UserContext);
  const supabase = useSupabaseClient();


  async function loadSvaed(nextPage, pageSize) {
    return supabase
      .from('saved_posts')
      .select('posts(id, content, created_at, photos, profiles(id, avatar, name))')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false })
      .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)
  }

  const { data, isLoading, isStale, fetchNextPage, refetch} = useInfiniteQuery({
    queryKey: ["savedposts"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await loadSvaed(pageParam, 3)
      return res.data
    },
    enabled:!!profile,

      getNextPageParam: (lastPage, allPages) => {
        // console.log({ lastPage, allPages });
        if (lastPage?.length === 3) {
          return allPages.length // Retourne le numéro de page suivant
        } else {
          return null // Indique qu'il n'y a plus de pages à récupérer
        }
      },
    
})



const posts = data?.pages.flatMap((page)=> page)
return (
  <Layout hideNavigation={false}>
    <h1 className="text-6xl mb-4 text-gray-300">Saved posts</h1>
    {
     (isLoading)?
     <>
     <ShimmerSocialPost type="both" />
     <ShimmerSocialPost type="both" />

   </>
     :
     (posts.length > 0) && posts.map(post => (
      <div key={post.posts.id}>
        <PostCard {...post.posts} />
      </div>
    ))
    }

  </Layout>
);
}