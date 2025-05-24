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

export async function getCreatorApiKey(creatorId: number): Promise<string | null> {
    // Ensure only the authenticated creator can fetch their key
    const user = await getUserFromSession();
    if (user?.creatorId !== creatorId) {
        console.error("Unauthorized attempt to fetch API key.");
        return null; // Or throw an error
    }

    try {
        // This is a placeholder. Your actual API endpoint might differ.
        // It should securely fetch the API key for the creator.
        const response = await axiosInstance.get<{ apiKey: string }>(`${API_ROUTES.CREATOR.API_KEY}/${creatorId}`);
        return response.data.apiKey ?? null;
    } catch (error) {
        console.error("Error fetching creator API key:", error);
        return null; // Return null on error
    }
}

export async function updateCreatorApiKey(creatorId: number, apiKey: string): Promise<{
    success: boolean;
    message?: string
}> {
    const user = await getUserFromSession();
    if (user?.creatorId !== creatorId) {
        return {success: false, message: "Unauthorized."};
    }

    try {
        await axiosInstance.post(`${API_ROUTES.CREATOR.API_KEY}/${creatorId}`, {apiKey});
        return {success: true};
    } catch (error) {
        console.error("Error updating creator API key:", error);
        return {success: false, message: "Failed to update API key."};
    }
}


export async function deleteCreatorApiKey(): Promise<{ success: boolean; message?: string }> {
    const user = await getUserFromSession();

    const creatorId = user?.creatorId ?? 0;

    try {
        await axiosInstance.delete(`${API_ROUTES.CREATOR.API_KEY}/${creatorId}`);
        return {success: true};
    } catch (error) {
        console.error("Error deleting creator API key:", error);
        return {success: false, message: "Failed to delete API key."};
    }
}
