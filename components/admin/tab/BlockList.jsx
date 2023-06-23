
import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ReactTimeAgo from 'react-time-ago';
import { FolderOpen, Loader2, Unlock } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


const BlockList = () => {

    const supabase = useSupabaseClient()
    const { toast } = useToast()

    const { data, isLoading, isError, refetch } = useQuery({
        queryFn: async () => {
            const { data } = await supabase.from("profiles")
                .select('id, name, avatar, bloc_at')
                .eq("isblock", true)
            return data
        },
        queryKey: ['block-user']
    })

    const { mutate: UnLock, isLoading: isUnlocking } = useMutation(
        async ({ user }) => {

            const { data } = await supabase
                .from("profiles")
                .update({
                    isblock: false,
                    bloc_at: null
                })
                .eq('id', user)
                .select('name')


            return data
        },

        {
            onError: (error) => {
                return toast({
                    title: "Something went wrong..",
                    description: 'Could not unlock this user acount, please retry later',
                    variant: 'destructive'
                })
            },
            onSuccess: (data) => {
                refetch()
                return toast({
                    description: `Sucessfull unlock User Account of ${data.name}`,
                    variant: 'default'
                })
            },
        }

    )

    if (isError) {
        return <h1>Error occur</h1>
    }
    return (
        <>
            <div className='p-4'>
                <div className='w-[80%]  m-auto p-4 border rounded-lg bg-white'>
                    <div className='my-3  p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between'>
                        <span className='ml-4'>Name</span>
                        <span className='sm:text-left text-right ml-4'>Disable date</span>
                    </div>
                    <ul className='max-h-[70vh]  overflow-y-scroll px-4'>
                        {
                            isLoading ?
                                <div className='flex flex-col gap-4 justify-center items-center w-full h-full bg-gray-50 '>
                                    {Array.from({ length: 5 }).map((v, i) => (<Skeleton key={i} className='w-full h-10 my-2' />))}
                                </div>

                                :
                                <>
                                    {data && data.length > 0 ? data.map((user) => (
                                        <li key={user.id} className='bg-gray-50 font-semibold hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between '>
                                            <div className='flex items-center'>
                                                <div className='bg-emerald-100 p-3 rounded-lg'>
                                                    <Avatar url={user.avatar} />
                                                </div>
                                                <p className='pl-4'>{user.name}</p>
                                            </div>
                                            <p className='hidden md:flex'> <ReactTimeAgo date={(new Date(user.bloc_at)).getTime()} /></p>
                                            <Button className='sm:flex hidden font-black justify-center gap-5 items-center w-1/4 ' disabled={isUnlocking} onClick={()=> UnLock({user: user.id})}>
                                                {isUnlocking ? <Loader2 className="animate-spin h-6 w-6" />

                                                    :
                                                    
                                                <Unlock />
                                                }

                                            </Button>
                                        </li>
                                    )) :
                                        <div className='flex flex-col gap-4 justify-center items-center w-full h-full bg-gray-50 '>
                                            <FolderOpen className='w-14 h-14 text-zinc-400 mt-8' />
                                            <h2 className='font-bold text-2xl text-zinc-600 mb-8'>No user found</h2>
                                        </div>
                                    }
                                </>
                        }

                    </ul>
                </div>
            </div>
        </>

    );
};

export default BlockList;
