import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertOctagon, Loader2, Lock } from 'lucide-react'
import React from 'react'
import { SiMinutemailer } from 'react-icons/si'
import ReactTimeAgo from 'react-time-ago'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/router'

function SignalInfo({ userId , reload}) {
    const supabase = useSupabaseClient()
    const { toast } = useToast()
    const client = useQueryClient()

    const { data: info, isLoading, isError, refetch } = useQuery({
        queryFn: async () => {
            const { data } = await supabase.from("warnings")
                .select('created_at, profiles(name)')
                .eq('user', userId)
                .order('created_at', { ascending: false })

            return data

        },
        queryKey: ['report-info', userId]
    })

    const { mutate: MakeWarn, isLoading: isWarn } = useMutation(
        async ({ user, admin }) => {
            const { data } = await supabase
                .from("warnings")
                .insert({
                    user: user,
                    admin: admin
                }).select('*')
               
            return data
        },
        {
            onError: (error) => {
                return toast({
                    title: "Something went wrong..",
                    description: 'Could not sent warning to user, please retry later',
                    variant: 'destructive'
                })
            },
            onSuccess: async (data) => {
               await supabase.from("notifications").insert({author: userId, type: "warning"})
                refetch()
                return toast({
                    description: `Sucessfull send warning to ${info[0].profiles.name}`,
                    variant: 'default'
                })
            },
        }

    )

    const { mutate: Block, isLoading: isBlock } = useMutation(
     async ({ user }) => {
            const date = new Date()
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2); // Les mois commencent à partir de 0
            var day = ('0' + date.getDate()).slice(-2);
            var hours = ('0' + date.getHours()).slice(-2);
            var minutes = ('0' + date.getMinutes()).slice(-2);
            var seconds = ('0' + date.getSeconds()).slice(-2);
            var milliseconds = ('00' + date.getMilliseconds()).slice(-3);

            // Création du timestamp dans le format souhaité
            var timestamp = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + '+00';

            const { data } = await supabase
                .from("profiles")
                .update({
                    isblock: true,
                    bloc_at: timestamp
                })
                .eq('id', user)
                .select('*')


            return data
        },

        {
            onError: (error) => {
                return toast({
                    title: "Something went wrong..",
                    description: 'Could not this user acount, please retry later',
                    variant: 'destructive'
                })
            },
            onSuccess: (data) => {
                reload()
                return toast({
                    description: `Sucessfull User Account of ${info[0].profiles.name}`,
                    variant: 'default'
                })
            },
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
            <p className='text-gray-600 sm:text-left text-right'>{info?.length}</p>
            <p className='hidden md:flex'>
                {info.length > 0 ?
                    <ReactTimeAgo date={(new Date(info[0].created_at)).getTime()} /> : 0
                }
            </p>
            <div className='flex w-full'>
                <Button onClick={() => MakeWarn({ user: userId, admin: 1 })} variant='default' className='sm:flex hidden font-black justify-center gap-5 items-center w-1/4 mr-4 '>

                    {isWarn ? <Loader2 className="animate-spin h-6 w-6" />

                        :
                        <AlertOctagon size={20} className='cursor-pointer text-white' />
                    }
                </Button>
                <Button onClick={() => Block({ user: userId })} variant='default' disabled={info.length < 3 || isBlock} className='sm:flex hidden hover:bg-red-600 font-black justify-center gap-5 items-center w-1/4 '>

                    {isBlock ? <Loader2 className="animate-spin h-6 w-6" />

                        :
                        <Lock size={20} className='cursor-pointer text-white' />
                    }
                </Button>
            </div>
        </>
    )
}

export default SignalInfo
