import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { BsPersonFill } from 'react-icons/bs'
import SkeletonDemo from '../skeletonDemo'

function AboutSignal({postid}) {
    const supabase = useSupabaseClient()
    const {data, isLoading, isError} = useQuery({
        queryKey: ["report",postid,'persson'],
        queryFn: async ()=>{
            const {data} = await supabase
            .from("reports")
            .select("profiles(id,name,avatar)")
            .eq('post_id', postid)
            console.log(data);
            return data
        }
    })

    if(isLoading){
        return(
            <>
            {Array.from({length: 5}).map((v,i)=>(<SkeletonDemo key={i}/>))}
            </>
        )
    }
  return (
    <>
      <div className='p-4 mt-6'>
          <div className='w-[80%]  m-auto p-4 border rounded-lg bg-white'>
            <div className='my-3  p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between'>
              <span className='ml-4 font-semibold'>Report by</span>
            </div>
            <ul className='max-h-[70vh]  overflow-y-scroll px-4'>
              {data.map((post) => (
                <li key={post.profiles.id} className='bg-gray-50 font-semibold hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between '>
                  <div className='flex items-center'>
                    <div className='bg-emerald-100 p-3 rounded-lg'>
                      <BsPersonFill className='text-emerald-500' />
                    </div>
                    <p className='pl-4'>{post.profiles.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </>
  )
}

export default AboutSignal
