"use server"

import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TCreator} from "@/global/types";
import {v2 as cloudinary} from "cloudinary";


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


export async function uploadCreatorBanner(userId: string | number, file: File | null) {
    if (file === null) {
        throw new Error("No file to upload");
    }
    try {

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileStr = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${fileStr}`;

        const response = await cloudinary.uploader.upload(fileUri, {
            folder: `${userId}/banner`,
            filename_override: "banner",
            resource_type: "image",
            overwrite: true,
            transformation: [
                {width: 1200, height: 400, crop: "limit"},
                {quality: "auto"},
            ],
        });

        return response.secure_url;
    } catch (err) {
        console.log(err);
        throw new Error("Error uploading creator banner");
    }
}

export async function UpdateCreatorDetails(creator: TCreator) {
    try {
        const response = await axiosInstance.put<TCreator>(API_ROUTES.CREATOR.BASE + `/${creator.creatorId}`, creator);

        return response.data;
    } catch {

        throw new Error("Error updating creator details");
    }
}