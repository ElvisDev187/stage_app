import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { BsArchive } from 'react-icons/bs'
import ReactTimeAgo from 'react-time-ago'

function SignalInfo({ userId }) {
    const supabase = useSupabaseClient()
    const { data, isLoading , isError} = useQuery({
        queryFn: async () => {
            const { data } = await supabase.from("reports")
                .select('posts(profiles(id)), created_at')
                .eq('posts.profiles.id', userId)
                .order('created_at', { ascending: false })


                var tableauFiltre = data.filter(function(objet) {
                    return objet.posts.profiles !== null;
                  });
            return tableauFiltre

        },
        queryKey: ['report-info', userId]
    })

    if (isLoading) {
        return (
            <>
                <p className='text-gray-600 sm:text-left text-right'><Loader2 className='animate-spin mr-2 h-5 w-5'/></p>
                <p className='hidden md:flex'><Loader2 className='animate-spin mr-2 h-5 w-5'/></p>
            </>
        )
    }
    if(isError){
        return <h1>error</h1>
    }
    return (
        <>
            <p className='text-gray-600 sm:text-left text-right'>{data.length}</p>
            <p className='hidden md:flex'> <ReactTimeAgo timeStyle={'twitter'} date={(new Date(data[0].created_at)).getTime()} /></p>
            <div className='sm:flex hidden justify-center gap-5 items-center'>
                <BsArchive size={20} className='cursor-pointer' />
            </div>
        </>
    )
}

export default SignalInfo
