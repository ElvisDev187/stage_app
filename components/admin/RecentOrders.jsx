import React from 'react';

import { GrTasks } from 'react-icons/gr';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import ReactTimeAgo from "react-time-ago";
import { ShimmerThumbnail } from 'react-shimmer-effects';
import Link from 'next/link';
export default function RecentOrders({ recent, isLoading, isError, }) {

  if (isError) {
    return "Something went wrong"
  }
  return (


    <div className='w-full col-span-1 relative  m-auto p-4 border rounded-lg bg-white '>
      <h1 className='font-bold text-gray-900' >Recent report - 12 Hours</h1>
      <ul className='overflow-y-scroll lg:h-[70vh] h-[45vh] px-3'>
        {
          isLoading ?
            <div className='mt-5'>
              {Array.from({ length: 8 }).map((i,index) => (<ShimmerThumbnail height={50}  className='w-full h-14' key={index} />))}
            </div>

            :
            
              recent.map((report) => (
                <Link
                  href={`/admin/post/${report.posts.id}`}
                  key={report.id}
                  className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer relative'
                >
                  <div className='bg-emerald-100 rounded-lg p-3'>
                    <GrTasks className='text-emerald-500' />
                  </div>
                  <div className='pl-4'>
                    <p className='text-gray-800 font-bold'>{report.profiles.name}</p>
                    <p className='text-gray-400 text-sm'>{report.posts.profiles.name}</p>
                  </div>
                  {/* <p className='lg:flex md:hidden absolute right-6 text-sm'>{report.profiles.name}</p> */}
                  <span className="lg:flex md:hidden absolute right-6 text-sm font-bold text-gray-400">
                    <ReactTimeAgo timeStyle={'twitter'} date={(new Date(report.created_at)).getTime()} />
                  </span>
                </Link>
              ))
            
        }
      </ul>
    </div>
  );
};


