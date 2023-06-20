import '../styles/globals.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useEffect, useState } from "react";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json';
import Layout from '../components/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserContextProvider } from '../contexts/UserContext';
import Avatar from '../components/Avatar';
import { BiPlus, BiMessageAdd } from 'react-icons/bi'
import CreatePostDialog from '../components/CreatePostDialog';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
TimeAgo.addLocale(en);

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter()
  // const [play] = useSound('/audio/sound1.mp3', {volume: 1})
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        keepPreviousData: false,
        refetchOnWindowFocus: true,
        refetchOnMount: true
      }
    }
  }))

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <div className={`relative min-h-full w-full ${router.asPath.includes("/admin")? "w-[100vw]": "md:w-[80vw]"}`}>
            {router.asPath == '/' && (
              <CreatePostDialog>
              <div className="absolute cursor-pointer shadow-gray-400 shadow-md flex items-center bg-green-500 text-white font-bold text-3xl justify-center w-[80px] h-[80px] rounded-full z-50 right-5 bottom-[250px] md:right-[200px] md:bottom-[150px]">
                <BiMessageAdd/>
              </div>
            </CreatePostDialog>
            )}
            <Component {...pageProps} />
            <Toaster/>
          </div>
        </UserContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionContextProvider>
  );
  //return <Component {...pageProps} />
}

export default MyApp
