import React from 'react';
import Link from 'next/link';
import { RxSketchLogo} from 'react-icons/rx';
import { UserPlus2,  AlertTriangle, ShieldAlert,LayoutGrid, Lock } from 'lucide-react';
import Header from './Header';
export default function Sidebar({ children , active}){
  return (
    <div className='flex'>
      <div className='fixed  h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between'>
        <div className='flex flex-col items-center'>
          
            <div className='bg-purple-800 text-white p-3 rounded-lg inline-block'>
              <RxSketchLogo size={20} />
            </div>
          
          <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
          <Link href='/admin'>
            <div className={`  cursor-pointer my-4 p-3 rounded-lg inline-block ${active == "home"? "bg-socialBlue text-white": "bg-gray-100 text-zinc-800 hover:bg-blue-200 hover:scale-110"}`}>
              <LayoutGrid className="h-6 w-6" />
            </div>
          </Link>
          <Link href='/admin/users'>
            <div className={`  cursor-pointer my-4 p-3 rounded-lg inline-block ${active == "users"? "bg-socialBlue text-white": "bg-gray-100 text-zinc-800 hover:bg-blue-200 hover:scale-110"}`}>
            <AlertTriangle className="h-6 w-6"/>
            </div>
          </Link>
          <Link href='/admin/reports'>
            <div className={`  cursor-pointer my-4 p-3 rounded-lg inline-block ${active == "reports"? "bg-socialBlue text-white": "bg-gray-100 text-zinc-800 hover:bg-blue-200 hover:scale-110"}`}>
              <ShieldAlert className="h-6 w-6" />
            </div>
          </Link>
          <Link href='/admin/block'>
            <div className={`  cursor-pointer my-4 p-3 rounded-lg inline-block ${active == "block"? "bg-socialBlue text-white": "bg-gray-100 text-zinc-800 hover:bg-blue-200 hover:scale-110"}`}>
              <Lock className="h-6 w-6" />
            </div>
          </Link>
          <Link href='/admin/new'>
            <div className={`  cursor-pointer my-4 p-3 rounded-lg inline-block ${active == "new"? "bg-socialBlue text-white": "bg-gray-100 text-zinc-800 hover:bg-blue-200 hover:scale-110"}`}>
              <UserPlus2  className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </div>
      <main className='ml-20 w-full bg-gray-100 min-h-screen'>
        <Header />
        {children}
      </main>
    </div>
  );
};


