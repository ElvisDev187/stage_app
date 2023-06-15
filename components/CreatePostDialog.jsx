import React, { useContext, useState } from 'react'
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
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { UserContext } from '../contexts/UserContext';

import Preloader from './Preloader';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react';
import { Button } from './ui/button';

const CreatePostDialog = ({ children }) => {

    const [content, setContent] = useState('');
    const [uploads, setUploads] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const supabase = useSupabaseClient();
    const session = useSession();
    const { profile } = useContext(UserContext);
    const client = useQueryClient()


    function handleClickOutsideDropdown(e) {
        e.stopPropagation();
        setDropdownOpen(false);
    }


    function createPost() {
        supabase.from('posts').insert({
            author: session.user.id,
            content,
            photos: uploads,
        }).then(response => {
            if (!response.error) {
                setContent('');
                setUploads([]);
                toast.success("Sucess creation")
                client.invalidateQueries("posts")
            }
        });
    }


    async function addPhotos(ev) {
        const files = ev.target.files;
        if (files.length > 0) {
            setIsUploading(true);
            for (const file of files) {
                const newName = Date.now() + file.name;
                const result = await supabase
                    .storage
                    .from('photos')
                    .upload(newName, file);
                if (result.data) {
                    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
                    setUploads(prevUploads => [...prevUploads, url]);
                } else {
                    console.log(result);
                }
            }
            setIsUploading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className='w-[500px]'>
                <AlertDialogHeader>
                    <AlertDialogTitle >
                        Create New Poste
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <>
                            <div className="flex gap-2 mb-5">
                                {profile && (
                                    <textarea value={content}
                                        onChange={e => setContent(e.target.value)}
                                        className="grow p-3 max-h-max h-20" placeholder={`Whats on your mind, ${profile?.name}?`} />
                                )}
                            </div>
                            {isUploading && (
                                <div>
                                    <Preloader />
                                </div>
                            )}
                            {uploads.length > 0 && (
                                <div className="flex gap-2">
                                    {uploads.map(upload => (
                                        <div className="mt-2 w-[120px] h-24 flex justify-center items-center relative" key={upload} >
                                            <LazyLoadImage effect="blur" src={upload} alt="photoPost" className="w-full h-ull rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button>
                        <label className="flex gap-1 cursor-pointer">
                            <input type="file" className="hidden" multiple onChange={addPhotos} />
                            <ImagePlus />
                         <span className="hidden md:block">Photos</span>
                        </label>
                    </Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <div id="" onClick={() => createPost()}>
                        <AlertDialogAction className='bg-socialBlue'>Create</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreatePostDialog
