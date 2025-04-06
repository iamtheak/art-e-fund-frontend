"use server"

import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";
import {auth} from "@/auth";
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TUser} from "@/global/types";
import {v2 as cloudinary} from "cloudinary"
import {AxiosError} from "axios";
import {getUserFromSession} from "@/global/helper";


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function addProfilePicture(image: string) {
    const user = await getUserFromSession()
    if (user === null) {
        throw new Error("Need to be a logged in user");
    }
    try {
        const res = await cloudinary.uploader.upload(image, {
            folder: `${user.userId}`,
            public_id: `profile-${user.userId}`,
            overwrite: true,
            filename_override: "profile",
        });
        return res.secure_url;
    } catch (ex) {
        console.log(ex)
        return null;
    }
}

export async function removeProfilePicture() {
    const user = await getUserFromSession()
    if (user === null) {
        throw new Error("Need to be a logged in user");
    }
    try {
        const res = await cloudinary.uploader.destroy(`${user.userId}/profile/profile-${user.userId}`);
        return res.result === "ok";
    } catch (ex) {
        console.log(ex)
        return false;
    }
}

export async function removePicture(publicId: string) {
    try {
        const res = await cloudinary.uploader.destroy(publicId);
        return res.result === "ok";
    } catch (ex) {
        console.log(ex)
        return false;
    }
}

export async function updateProfile(data: TProfileFormValues, userProfileUrl: string) {
    try {

        const ses = await auth();

        if (ses === null) {
            return null;
        }

        const resp = await axiosInstance.put<TUser>(`${API_ROUTES.USER}/${ses.user.userId}`, {
            ...data,
            profilePicture: userProfileUrl
        });

        if (resp) {
            return resp.data;
        }

        return null;

    } catch (ex) {
        if (ex instanceof AxiosError) {
            console.log(ex.config)
            console.log(ex.response?.data)
        }

        return null;
    }
}