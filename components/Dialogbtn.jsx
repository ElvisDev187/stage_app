
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTrigger,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle

} from './ui/alert-dialog'
import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

export function AlertDialogDemo({ children, id, user }) {
    const [isLoading, setLoad] = useState(false)
    const close = useRef(null)
    const supabase = useSupabaseClient()
    async function addTorepport() {
        setLoad(true)
       const {error} = await supabase.from("reports")
            .insert({
                post_id: id,
                user_id: user,
            })

        if (!error) {
        {/* TODO: Taost*/}
        }
        
        setLoad(false)

    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>

                    <AlertDialogAction ref={close} className='hidden' ></AlertDialogAction>
                    <Button disabled={isLoading} onClick={async () => {
                       await addTorepport()
                       close.current.click()
                    }}> 
                    {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
                       Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
