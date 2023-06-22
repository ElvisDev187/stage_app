
import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ReactTimeAgo from 'react-time-ago';
import { FolderOpen, Unlock } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Sidebar from '@/components/admin/Sidebar';

const Customers = () => {

    const supabase = useSupabaseClient()

    const { data, isLoading, isError, } = useQuery({
        queryFn: async () => {
            const { data } = await supabase.from("profiles")
                .select('id, name, avatar, bloc_at')
                .eq("isblock", true)
            return data
        },
        queryKey: ['block-user']
    })

    if (isError) {
        return <h1>Error occur</h1>
    }
    return (
        <Sidebar>
            <div className='bg-gray-100 min-h-screen'>
                <div className='flex justify-between p-4'>
                    <h2>Customers</h2>
                    <h2>Welcome Back, Clint</h2>
                </div>
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
                                        {Array.from({length: 5}).map((v,i)=>(<Skeleton key={i} className='w-full h-10 my-2'/>))}
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
                                                <p className='hidden md:flex'> <ReactTimeAgo date={(new Date(user.block_at)).getTime()} /></p>
                                                <Button className='sm:flex hidden font-black justify-center gap-5 items-center w-1/4 '> <Unlock /> </Button>
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
            </div>
        </Sidebar>
    );
};

export default Customers;
