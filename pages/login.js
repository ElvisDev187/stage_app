import Layout from "../components/Layout";
import Card from "../components/Card";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";
import {Button }  from '../components/ui/button'
import { useState } from "react";
import { Loader2, UserCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";




export default function LoginPage({ }) {

  const [pwd, setpwd] = useState("")
  const [login, setlogin] = useState("")
  const supabase=  useSupabaseClient()
  const {toast} = useToast()
  const router = useRouter()

  async function loginWithFacebook() {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    });
  }
  const { mutate, isLoading } = useMutation(
   async ({email,pass})=>{
      const { data} =await supabase.auth.signInWithPassword({email:email, password:pass});
      return data
    },
    {
        onError: (error) => {
            return toast({
                title: "Invalid Information",
                description: 'Could not find user account with these information, please retry later',
                variant: 'destructive'
            })
        },
        onSuccess: async (data) => {
          const {data: user } = await supabase.from("profiles").select("isblock").eq('id', data?.user?.id);
          if (user[0].isblock) {  
            document.cookie = "supabase-auth-token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
            toast({
               title: `Soory, ${data?.user?.user_metadata?.full_name}`,
               description: 'Your has been blocked',
               variant: "destructive"
           })
          }else{
            toast({
              title: `Wellcome back, ${data?.user?.user_metadata?.full_name}`,
              description: 'You will be redirect in few second..',
          })
          router.push('/')
          }
        },
        onSettled: () => {
            resetForm()
        },
        retry: 0
    }
  )

  function resetForm() {
    setlogin("")
    setpwd("")
}
const isEmpty = () => {
    return ( login.trim().length == 0 || pwd.length == 0 )
}


  return (
    <Layout hideNavigation={true}>
      <Head>
        <title>EcoShip | Login</title>
      </Head>
      <div className='px-20 min-h-fit bg-gray-50 mt-40 py-10 flex justify-start items-center flex-col rounded-lg '>
            <UserCircle2 className='h-20 w-20 mt-5  text-zinc-600' absoluteStrokeWidth={true} />
            <h1 className=' font-semibold text-2xl md:text-2xl text-zinc-900 mt-5'>Happy to see You Again</h1>
            <div className='w-1/2 mt-6'>
                <Card>
                    <div className="flex flex-col gap-3 w-full">
                        <input
                            required
                            onChange={(e) => { setlogin(e.target.value) }}
                            value={login}
                            className='bg-white-500 border  shadow-sm border-gray-300 px-2 py-4 focus:outline-none rounded-sm text-md text-gray-700 mt-3 mb-0'
                            type="email"
                            placeholder="Email" />
                        <input
                            required
                            onChange={(e) => { setpwd(e.target.value) }}
                            value={pwd}
                            className='bg-white-500 border  shadow-sm border-gray-300 px-2 py-4 focus:outline-none rounded-sm text-md text-gray-700 mt-3 mb-0'
                            type="password"
                            placeholder="Password" />
                        <Button className="bg-emerald-400" disabled={isEmpty()} onClick={() => {  mutate({  email: login, pass: pwd })}}>
                            {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}  Login
                        </Button>
                        <Button className="bg-emerald-400"  onClick={loginWithFacebook}>
                             Login wit facebook
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






