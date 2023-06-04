/* eslint-disable react-hooks/exhaustive-deps */
import PostFormCard from "../components/PostFormCard";
import PostCard from "../components/PostCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useEffect, useState } from "react";


export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession()
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [session?.user?.id]);

  function fetchPosts() {
    supabase.from('posts')
      .select('id, content, created_at, photos, profiles(id, avatar, name)')
      .is('parent', null)
      .order('created_at', { ascending: false })
      .then(result => {
        // console.log('posts', result);
        setPosts(result.data);
      })
  }

  if (!session) {
    return <LoginPage />
  }
  return (
    <>

      <PostFormCard onPost={fetchPosts} />
      {posts?.length > 0 && posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}

    </>
  )
}

// export function getStaticProps(){
//   return {
//     props: { nav: true}
//   }
// }
