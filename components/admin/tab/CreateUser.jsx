import Card from '@/components/Card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import { Loader2, UserCircle2 } from 'lucide-react'
import Head from 'next/head'
import React, { useState } from 'react'

function CreateUser() {
    const [FullName, setFullName] = useState("")
    const [Email, setEmail] = useState("")
    const [Pwd, setPwd] = useState("")
    const [Confirm, setConfirm] = useState("")

    const supabase = useSupabaseClient()
    const { toast } = useToast()

    const { mutate, isLoading } = useMutation(
         async ({ name, email, pass, }) => {
            const { data } = await supabase.auth.signUp({ email, password: pass, options: { shouldCreateUser: true, data: { full_name: name }  } })
            console.log(data);
            return data
        },
        {
            onError: (error) => {
                return toast({
                    title: "Something went wrong..",
                    description: 'Could not create user now, please retry later',
                    variant: 'destructive'
                })
            },
            onSuccess: (data) => {
                return toast({
                    title: "Success Action",
                    description: `New user created, remember the password : ${Pwd} to comunicate to the user`,
                    variant: 'default'
                })
            },
            onSettled: () => {
                resetForm()
            },
            retry: 0
        }
    )

    function resetForm() {
        setConfirm("")
        setEmail("")
        setPwd("")
        setFullName("")
    }
    const isEmpty = () => {
        return (FullName.trim().length == 0 || Email.trim().length == 0 || Pwd.length == 0 || Confirm.length == 0)
    }
    const isNotMatch = () => {
        return (Pwd != Confirm)
    }
    const OkReg = (password) => {
        const reg = new RegExp(/^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)(?=[^!#%]*[!#%])[A-Za-z0-9!#%]{8,32}$/gm)
        return reg.test(password)
    }
    return (
        <div className='px-40 min-h-screen bg-gray-100 flex justify-start items-center flex-col '>
            <Head>
                <title>EcoShip | Admin | New User</title>
            </Head>
            <UserCircle2 className='h-20 w-20 mt-5  text-zinc-600' absoluteStrokeWidth={true} />
            <h1 className=' font-semibold text-2xl md:text-3xl text-zinc-400 mt-5'>Add User</h1>
            <div className='w-1/2 mt-6'>
                <Card>
                    <div className="flex flex-col gap-3 w-full">
                        <input
                            required
                            onChange={(e) => { setFullName(e.target.value) }}
                            value={FullName}
                            className='bg-white-500 border  shadow-sm border-gray-300 px-2 py-4 focus:outline-none rounded-sm text-md text-gray-700 mt-3 mb-0'
                            type="text"
                            placeholder="Full Name" />
                        <input
                            required
                            onChange={(e) => { setEmail(e.target.value) }}
                            value={Email}
                            className='bg-white-500 border  shadow-sm border-gray-300 px-2 py-4 focus:outline-none rounded-sm text-md text-gray-700 mt-3 mb-0'
                            type="email"
                            placeholder="Email" />
                        <input
                            required
                            onChange={(e) => { setPwd(e.target.value) }}
                            value={Pwd}
                            className='bg-white-500 border  shadow-sm border-gray-300 px-2 py-4 focus:outline-none rounded-sm text-md text-gray-700 mt-3 mb-0'
                            type="password"
                            placeholder="Password" />
                        <input
                            required
                            onChange={(e) => { setConfirm(e.target.value) }}
                            value={Confirm}
                            className='bg-white-500 border  shadow-sm border-gray-300 px-2 py-4 focus:outline-none  rounded-sm text-md text-gray-700 mt-3 mb-0'
                            type="password"
                            placeholder="Confirm Password" />
                        <Button className="bg-emerald-400" disabled={isEmpty()} onClick={() => {
                            if (!OkReg(Pwd)) {
                                return toast({
                                    title: "Inalid Data",
                                    description: "Password must be have 8-32 caracters: 1 number and special caracter !#%",
                                    variant: "destructive"
                                })
                            }
                            if (isNotMatch()) {
                                return toast({
                                    title: "Inalid Data",
                                    description: "Password and Confirm Pasword must be Same",
                                    variant: "destructive"
                                })
                            }

                            mutate({ name: FullName, email: Email, pass: Pwd })
                        }}>
                            {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}  Create
                        </Button>
                        <Button variant={'outline'} onClick={() => resetForm()}>Cancel</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default CreateUser
