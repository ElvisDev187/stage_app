import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useEffect, useState } from "react";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json';
import Layout from '../components/Layout';

TimeAgo.addDefaultLocale(en);

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  // const [nav, setNav] =  useState(null)
  // useEffect(()=>{
  //   if(pageProps.nav == true){
  //     setNav(true)
  //   }else{
  //     setNav(false)
  //   }
  // },[pageProps])
  const nav = (!!pageProps.nav)
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >   <Layout hideNavigation={nav}>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
  //return <Component {...pageProps} />
}

export default MyApp
