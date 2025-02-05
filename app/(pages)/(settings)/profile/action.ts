"use server"

import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";
import {auth} from "@/auth";
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TUser} from "@/global/types";
import {v2 as cloudinary} from "cloudinary"
import {AxiosError} from "axios";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function addProfilePicture(image: string) {
    try {
        const res = await cloudinary.uploader.upload(image, {
            filename_override: "profile",
        });
        return res.secure_url;
    } catch (ex) {
        console.log(ex)
        return null;
    }
}

export async function removePicture(imageUrl: string) {
    try {

        const image = imageUrl.split("/")

        const publicId = image[image.length - 1].replace(".jpg","");
        console.log(publicId)
        const res = await cloudinary.uploader.destroy(publicId);
        return res.result === "ok";
    } catch (ex) {
        console.log(ex)
        return false;
    }
}

export async function UpdateProfile(data: TProfileFormValues, userProfileUrl: string) {
    try {

        const ses = await auth();

        if (ses === null) {
            return null;
        }

        console.log(axiosInstance.defaults.baseURL)
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
            console.log(ex.response?.data)
        }

        return "error";
    }
}