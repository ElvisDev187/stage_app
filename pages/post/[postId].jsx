import { useRouter } from 'next/router'
import {useCallback, useEffect, useState} from 'react'
import Layout from '../../components/Layout'
import PostCard from '../../components/PostCard'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'

const PostDetailPage = ({post}) => {

  return ( 
    <Layout hideNavigation={true} back={true}>
      <PostCard {...post}/>
    </Layout>
  )
}

export default PostDetailPage

// export async function getStaticPaths(){
//   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
//  const {data} = await supabase.from('posts')
//       .select('id')
//       .is('parent', null)
//       .order('created_at', { ascending: false })
//     const paths = data.map(post =>{
//       return{
//         params: { postId: `${post.id}`}
//       }
//     })

//     return {
//       paths,
//       fallback: false
//     }

// }
/**
 * 
 * @param {import('next').GetServerSidePropsContext} ctx 
 * @returns 
 */
export async function getServerSideProps(ctx){
  const { params } = ctx
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const {data} = await supabase.from("posts")
  .select('id, content, created_at, photos, profiles(id, avatar, name)')
  .eq('id', params.postId)

  return {
    props: {
      post: data[0],
    }
  }

}
