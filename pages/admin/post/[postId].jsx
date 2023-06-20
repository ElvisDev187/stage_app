

import AboutSignal from '@/components/admin/AboutSignal'
import PartialPostCard from '@/components/admin/PartialPost'
import Sidebar from '@/components/admin/Sidebar'
import { createClient } from '@supabase/supabase-js'

const PostDetailPage = ({ post }) => {

  return (
    <Sidebar>
      <div className=' overflow-y-scroll px-20 min-h-screen bg-gray-100'>
        <PartialPostCard {...post} />
        <AboutSignal postid={post.id} />
      </div>
    </Sidebar>
  )
}

export default PostDetailPage

/**
 * 
 * @param {import('next').GetServerSidePropsContext} ctx 
 * @returns 
 */
export async function getServerSideProps(ctx) {
  const { params } = ctx
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data } = await supabase.from("posts")
    .select('id, content, created_at, photos, profiles(id, avatar, name)')
    .eq('id', params.postId)

  return {
    props: {
      post: data[0],
    }
  }

}
