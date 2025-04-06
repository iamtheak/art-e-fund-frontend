"use client"
import ImageInput from "@/components/image-input/image-input";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import BaseDialog from "@/components/base-dialog/base-dialog";
import {useState} from "react";
import {TUser} from "@/global/types";
import Image from "next/image";

export default function CreatorAvatar({user}: { user: TUser }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={"w-full"}>

            <Avatar onClick={() => {
                setIsOpen(true)
            }} className={"w-40 h-40 cursor-pointer"}>
                {

                    user?.profilePicture &&
                    <Image className={"h-full w-full"} src={user?.profilePicture} fill
                           alt={"Profile picture of " + user?.userName}/>
                }
                <AvatarFallback>{user.userName}</AvatarFallback>
            </Avatar>

            <BaseDialog title={"Update your profile"} isOpen={isOpen} setIsOpen={setIsOpen}>
                <ImageInput image={user.profilePicture} onCropComplete={(croppedImageData) => {
                    console.log("asdf", croppedImageData)
                }}/>
            </BaseDialog>
        </div>
    )
}