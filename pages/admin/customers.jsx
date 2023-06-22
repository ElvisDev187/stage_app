
import React from 'react';
import { BsArchive, BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
// import { data } from '../../data/data';
import Sidebar from '../../components/admin/Sidebar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import SignalInfo from '../../components/SignalInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen } from 'lucide-react';

const Customers = () => {

  const supabase = useSupabaseClient()
  // Fonction de comparaison basée sur l'attribut "id" de "profiles"
  function comparerObjets(objet1, objet2) {
    return objet1.posts.profiles.id.localeCompare(objet2.posts.profiles.id);
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      const { data } = await supabase.from("reports").select('posts(profiles(id,name))')


      // Tri du tableau d'objets
      data.sort(comparerObjets);

      // Tableau pour stocker les objets uniques
      var tableauObjetsUniques = [];

      // Parcours du tableau trié pour éliminer les doublons
      for (var i = 0; i < data.length; i++) {
        // Vérification si l'objet suivant est différent de l'objet actuel
        if (i === 0 || comparerObjets(data[i], data[i - 1]) !== 0) {
          tableauObjetsUniques.push(data[i]);
        }
      }

      return tableauObjetsUniques
    },
    queryKey: ['signal-by']
  })

  if (isError) {
    return <h1>Error occur</h1>
  }

  if (isLoading) {
    return <h1>Loading...</h1>
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
              <span className='sm:text-left text-right ml-4'>Nb Warning</span>
              <span className='hidden md:grid'>Last warning</span>
              {/* <span className='hidden sm:grid'>Method</span> */}
            </div>
            <ul className='max-h-[70vh]  overflow-y-scroll px-4'>
              {
                isLoading ?
                  <div className='flex flex-col gap-4 justify-center items-center w-full h-full bg-gray-50 '>
                    {Array.from({ length: 5 }).map((v, i) => (<Skeleton key={i} className='w-full h-10 my-2' />))}
                  </div>

                  :
                  <>{data && data.length > 0 ? data.map((order, id) => (
                    <li key={id} className='bg-gray-50 font-semibold hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between '>
                      <div className='flex items-center'>
                        <div className='bg-emerald-100 p-3 rounded-lg'>
                          <BsPersonFill className='text-emerald-500' />
                        </div>
                        <p className='pl-4'>{order.posts.profiles.name}</p>
                      </div>
                      <SignalInfo userId={order.posts.profiles.id} />
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
