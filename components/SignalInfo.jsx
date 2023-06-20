import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { SiMinutemailer } from 'react-icons/si'
import ReactTimeAgo from 'react-time-ago'
import { Button } from './ui/button'

function SignalInfo({ userId }) {
    const supabase = useSupabaseClient()
    const { data, isLoading, isError } = useQuery({
        queryFn: async () => {
            const { data } = await supabase.from("reports")
                .select('posts(profiles(id)), created_at')
                .eq('posts.profiles.id', userId)
                .order('created_at', { ascending: false })


            var tableauFiltre = data.filter(function (objet) {
                return objet.posts.profiles !== null;
            });
            return tableauFiltre

        },
        queryKey: ['report-info', userId]
    })

    const { mutate, isLoading: isWarn } = useMutation({
        mutationFn: async ({user, admin}) => {
            const { data } = await supabase
                .from("warnings")
                .insert({
                    user: user,
                    admin: admin
                })

            return data
        }
    },

    {
        onError: (error)=>{
            console.log(error);
        }
    }
    
    )

    if (isLoading) {
        return (
            <>
                <p className='text-gray-600 sm:text-left text-right'><Loader2 className='animate-spin mr-2 h-5 w-5' /></p>
                <p className='hidden md:flex'><Loader2 className='animate-spin mr-2 h-5 w-5' /></p>
            </>
        )
    }
    if (isError) {
        return <h1>error</h1>
    }
    return (
        <>
            <p className='text-gray-600 sm:text-left text-right'>{data.length}</p>
            <p className='hidden md:flex'> <ReactTimeAgo date={(new Date(data[0].created_at)).getTime()} /></p>
            <Button onClick={() => mutate({user: userId, admin: 1})} variant='default' disabled={data.length < 3 || isWarn} className='sm:flex hidden bg-socialBlue font-black justify-center gap-5 items-center w-1/4 '>

                {isWarn ? <Loader2 className="animate-spin h-6 w-6" />

                    :
                    <SiMinutemailer size={20} className='cursor-pointer text-white' />
                }
            </Button>
        </>
    )
}

export default SignalInfo
