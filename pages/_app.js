import '../styles/globals.css'
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
  const client = new QueryClient()
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={client}>
        <Layout hideNavigation={nav}>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
    </SessionContextProvider>
  );
  //return <Component {...pageProps} />
}

export default MyApp
