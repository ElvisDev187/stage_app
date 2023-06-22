import React from 'react';
import Link from 'next/link';
import { RxSketchLogo, RxDashboard, RxPerson } from 'react-icons/rx';
import { UserPlus2,  AlertTriangle, ShieldAlert,LayoutGrid, Lock } from 'lucide-react';
export default function Sidebar({ children }){
  return (
    <div className='flex'>
      <div className='fixed  h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between'>
        <div className='flex flex-col items-center'>
          
            <div className='bg-purple-800 text-white p-3 rounded-lg inline-block'>
              <RxSketchLogo size={20} />
            </div>
          
          <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
          <Link href='/admin'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <LayoutGrid className="h-6 w-6" />
            </div>
          </Link>
          <Link href='/admin/customers'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
            <AlertTriangle className="h-6 w-6"/>
            </div>
          </Link>
          <Link href='/admin/orders'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <ShieldAlert className="h-6 w-6" />
            </div>
          </Link>
          <Link href='/admin/users/block'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <Lock className="h-6 w-6" />
            </div>
          </Link>
          <Link href='/admin/users/new'>
            <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <UserPlus2  className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </div>
      <main className='ml-20 w-full'>{children}</main>
    </div>
  );
};


