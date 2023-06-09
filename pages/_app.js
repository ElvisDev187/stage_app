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

TimeAgo.addDefaultLocale(en);

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [queryClient] = useState(()=> new QueryClient({
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
          <Component {...pageProps} />
        </UserContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionContextProvider>
  );
  //return <Component {...pageProps} />
}

export default MyApp
