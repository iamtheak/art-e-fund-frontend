"use client";

import UploadImage, {UploadImageRef} from "@/components/upload-image/upload-image";
import {Button} from "@/components/ui/button";
import {useRef, useState} from "react";
import {TCreator} from "@/global/types";
import {useMutation} from "@tanstack/react-query";
import {UpdateCreatorDetails, uploadCreatorBanner} from "@/app/[username]/action";
import {toast} from "@/hooks/use-toast";
import BaseDialog from "@/components/base-dialog/base-dialog";

export default function BannerDialogContent({creator}: { creator: TCreator }) {
    const uploadImageRef = useRef<UploadImageRef>(null);


    const [image, setImage] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);


    const onImageUpload = (files: File[] | undefined) => {

        if (files && files.length > 0) {
            const file = files[0];
            setImage(file);
        }
    }


    const onRemoveImage = () => {
        uploadImageRef.current?.clearImage();
    };

    const uploadBanner = useMutation({
        mutationFn: () => uploadCreatorBanner(creator.userName, image ?? null),
        onSuccess: (url) => {
            toast({title: "Banner updated", description: "Your banner has been updated successfully"});
            updateCreator.mutate(url)
        },
        onError: (error: Error) => {
            toast({title: "Error updating banner", description: error.message});
        }
    })

    const updateCreator = useMutation({
        mutationFn: (imageUrl: string) => {
            return UpdateCreatorDetails({...creator, creatorBanner: imageUrl ?? ""});
        },
        onSuccess: () => {
            toast({title: "Creator updated", description: "Your creator details have been updated successfully"});
            window.location.reload();
        },
        onError: (error: Error) => {
            toast({title: "Error updating creator", description: error.message});
        }
    })

    const onSave = () => {
        if (image !== null) {
            uploadBanner.mutate();
        } else {
            toast({title: "Error updating banner", description: "Please upload an image to update your banner"});

        }

    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="absolute top-3 right-3">
                Edit cover picture
            </Button>

            <BaseDialog
                title={"Edit your cover picture"}
                description={"You can upload a new cover picture for your profile"}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                className={"xl:min-w-[800px] min-w-90"}
                footer={
                    <div className={"relative flex w-full justify-between items-center"}>
                        <p className="text-red-500 underline cursor-pointer" onClick={onRemoveImage}>
                            Remove cover
                        </p>
                        <Button onClick={onSave}>Save</Button>
                    </div>}>

                <div
                    className="w-full h-72 border-dashed border-2 border-gray-300 flex text-center justify-center items-center">
                    <UploadImage ref={uploadImageRef} props={{onImageUpload, maxFiles: 1}}/>
                </div>
            </BaseDialog>
        </>
    )
        ;
}
