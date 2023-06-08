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

TimeAgo.addDefaultLocale(en);

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const nav = (!!pageProps.nav)
  const back = (!!pageProps.back)
  const client = new QueryClient({
    defaultOptions:{
      queries: {
      staleTime: 1000 * 60 * 2,
      keepPreviousData: true
    }
    }
  })
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={client}>
        <Layout hideNavigation={nav} back={back}>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </SessionContextProvider>
  );
  //return <Component {...pageProps} />
}

export default MyApp
