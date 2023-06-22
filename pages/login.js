import Layout from "../components/Layout";
import Card from "../components/Card";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import {Button }  from '../components/ui/button'
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";



export default function LoginPage({ }) {

  const [pwd, setpwd] = useState("")
  const [login, setlogin] = useState("")
  // const [isLoading,setIsLoading] = useState(false)   
  const supabase = useSupabaseClient();
  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  }
  async function loginWithFacebook() {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
  }
  async function loginWithGithub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  }

 

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({phone,pass})=>{
      const { data} =await supabase.auth.signUp({email:"elvisgala187@gmail.com", password:pass, phone: phone, options: {shouldCreateUser: true, data: { full_name: "gala elvis"}}});
      console.log(data)
      return data
    }
  })




  return (
    <Layout hideNavigation={true}>
      <Head>
        <title>EcoSocial | Login</title>
      </Head>
      <div className="h-screen flex items-center">
        <div className="max-w-xs mx-auto grow -mt-24">
          {/* <h1 className="text-6xl mb-4 text-green-300 text-center">Login</h1> */}
          <Card noPadding={true}>
            <div className="rounded-md">
              <button onClick={loginWithGoogle} className="flex w-full gap-4 items-center justify-center p-4 border-b border-b-gray-100 hover:bg-socialBlue hover:text-white hover:border-b-socialBlue hover:rounded-md hover:shadow-md hover:shadow-gray-300 transition-all hover:scale-110">
                <svg className="h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
                Login with Google
              </button>
              <button onClick={loginWithFacebook} className=" w-full flex gap-4 items-center justify-center p-4 border-b border-b-gray-100 hover:bg-socialBlue hover:text-white hover:border-b-socialBlue hover:rounded-md hover:shadow-md hover:shadow-gray-300 transition-all hover:scale-110">
                <svg className="h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg>
                Login with Facebook
              </button>
            </div>
          </Card>
          <p className="text-md font-bold text-center text-gray-800 mb-3" >OR</p>
          <Card>
            <div className="flex flex-col gap-3">
              <input
                required
                onChange={(e) => {setlogin(e.target.value) }}
                value={login}
                className='bg-white-500 border  shadow-md border-gray-300 p-2 focus:outline-none focus:shadow-blue-300 focus:shadow rounded-sm text-md text-gray-700 mt-3 mb-0'
                type="text"
                placeholder="Nom d'utilisateur ou Couriel" />
                <input
                required
                onChange={(e) => {setpwd(e.target.value) }}
                value={pwd}
                className='bg-white-500 border  shadow-md border-gray-300 p-2 focus:outline-none focus:shadow-blue-300 focus:shadow rounded-sm text-md text-gray-700 mt-3 mb-0'
                type="password"
                placeholder="Password" />
                <Button className="bg-socialBlue"  disabled={login.length == 0 || pwd.length == 0} onClick={()=>mutate({phone:login, pass:pwd})}>
                  {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}   Login
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

/**
 * 
 * @param {import('next').GetServerSidePropsContext} ctx 
 * @returns 
 */
export async function getServerSideProps(ctx) {
  const { cookies } = ctx.req
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const access_token = cookies["supabase-auth-token"]
  const data = JSON.parse(access_token || "{}")
  const user = await supabase.auth.getUser(data[0])
  if (user.data.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }

}






