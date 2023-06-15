
import 
{AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogTrigger,
AlertDialogDescription,
AlertDialogContent,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle

} from './ui/alert-dialog'

export function AlertDialogDemo({ children, onOk }) {
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <div id="mouf" onClick={()=>onOk()}>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
