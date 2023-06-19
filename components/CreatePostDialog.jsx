import React, { useContext, useRef, useState } from 'react'
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
import TextareaAutosize from 'react-textarea-autosize'
import Preloader from './Preloader';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQueryClient } from '@tanstack/react-query'

import toast from 'react-hot-toast';
import { ImagePlus } from 'lucide-react';
import { Button } from './ui/button';
import { v4 as uuid } from 'uuid';
import { Loader2 } from 'lucide-react';
const CreatePostDialog = ({ children }) => {

    const [content, setContent] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [Files, setFiles] = useState([]);
    const supabase = useSupabaseClient();
    const session = useSession();
    const { profile } = useContext(UserContext);
    const client = useQueryClient()
    const btnRef = useRef(null)

    async function previewFiles(e) {
        const preview = document.querySelector("#preview");
        const files = e.target.files

        function readAndPreview(file) {
            // Make sure `file.name` matches our extensions criteria
            if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                const reader = new FileReader();

                reader.addEventListener(
                    "load",
                    () => {
                        const image = new Image();
                        image.height = 100;
                        image.width = 150;
                        image.title = file.name;
                        image.src = reader.result;
                        preview.appendChild(image);
                    },
                    false
                );

                reader.readAsDataURL(file);
            }
        }

        if (files) {
            setFiles(prev=>[...files])
            Array.prototype.forEach.call(files, readAndPreview);
            
        }
    }



    function handleClickOutsideDropdown(e) {
        e.stopPropagation();
        setDropdownOpen(false);
    }


    async function createPost(images) {
       
        supabase.from('posts').insert({
            author: session.user.id,
            content,
            photos: images,
        }).then(response => {
            if (!response.error) {
                setContent('');
                setFiles([])
                toast.success("Sucess creation")
                client.invalidateQueries("posts")
            }
        });


    }


    async function addPhotos() {
       let res = [];

        try {
            setIsUploading(true);
            for (const file of Files) {
                const newName = uuid()
                const result = await supabase
                    .storage
                    .from('photos')
                    .upload(newName, file);
                if (result.data) {
                    let url =  process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
                   res = [...res,url]
                } else {
                    console.log(result);
                }
            }
            setIsUploading(false);

        } catch (err) {
            console.log(err);
        }

        return res;
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
                                    <TextareaAutosize
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        className="grow p-3 max-h-max h-20 w-full resize-none appearance-none overflow-hidden  focus:outline-none" placeholder={`Whats on your mind, ${profile?.name}?`} />
                                )}
                            </div>
                            <div className="flex gap-2 max-h-[100px]" id='preview'>
                            </div>
                        </>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button >
                        <label className="flex gap-1 cursor-pointer">
                            <input type="file" className="hidden" multiple accept="image/*" onChange={previewFiles} />
                            <ImagePlus />
                            <span className="hidden md:block">Photos</span>
                        </label>
                    </Button>
                    <AlertDialogCancel onClick={() => {
                        setContent('');
                        setFiles([])
                    }}>Cancel</AlertDialogCancel>

                    <AlertDialogAction ref={btnRef}  className='hidden'></AlertDialogAction>
                    <Button type="submit" disabled={content.length == 0 } onClick={async (e) => {
                      const uploads =   await addPhotos()
                        await createPost(uploads)
                        btnRef.current.click()
                    }} className='bg-socialBlue' >
                        {isUploading && <Loader2 className="animate-spin mr-2 h-4 w-4"/>}
                       Create
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreatePostDialog
