import { createClient } from "@supabase/supabase-js";
import { useInfiniteQuery } from "@tanstack/react-query"

async function fetchPosts(nextPage,pageSize){
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    return supabase.from('posts')
    .select('id, content, created_at, photos, profiles(id, avatar, name)')
    .is('parent', null)
    .order('created_at', { ascending: false })
    .range(nextPage * pageSize, (nextPage + 1) * pageSize - 1)
}

export const  UseInfinitePost =(pageSize) =>{

 return useInfiniteQuery(
    ['posts'],
    async ({ pageParam = 0 }) => {
      const res = await fetchPosts(pageParam, pageSize)
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
}