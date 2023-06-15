import React from 'react';

import { GrTasks } from 'react-icons/gr';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import ReactTimeAgo from "react-time-ago";
export default function RecentOrders({recent, isLoading}) {

  if (isLoading) {
    return "loading"
  }
  return (
    <div className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll'>
      <h1 className='font-bold text-gray-900' >Recent report - 12 Hours</h1>
      <ul>
        {recent.map((report) => (
          <li
            key={report.id}
            className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer'
          >
            <div className='bg-purple-100 rounded-lg p-3'>
              <GrTasks className='text-purple-800' />
            </div>
            <div className='pl-4'>
              <p className='text-gray-800 font-bold'>{report.profiles.name}</p>
              <p className='text-gray-400 text-sm'>{report.posts.profiles.name}</p>
            </div>
            {/* <p className='lg:flex md:hidden absolute right-6 text-sm'>{report.profiles.name}</p> */}
            <span className="lg:flex md:hidden absolute right-6 text-sm font-bold text-gray-400">
              <ReactTimeAgo timeStyle={'twitter'} date={(new Date(report.created_at)).getTime()} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

