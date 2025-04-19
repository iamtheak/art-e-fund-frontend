"use server"

import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TCreator} from "@/global/types";
import {v2 as cloudinary} from "cloudinary";
import {getUserFromSession} from "@/global/helper";
import {AxiosError} from "axios";
import {TDonationGoal} from "@/app/(pages)/view-donations/_components/validator";
import {Post} from "@/app/(pages)/manage-posts/action";


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
            folder: `${userId}`,
            filename_override: "banner",
            resource_type: "image",
            overwrite: true,
            transformation: [
                {width: 1200, height: 400, crop: "limit"},
                {quality: "auto"},
            ],
            public_id: `${userId}/banner`,
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

export async function EnrollMembership(membershipId: string | number) {

    const user = await getUserFromSession();

    if (user === null) {
        throw new Error("User should be logged in to enroll");
    }
    try {
        await axiosInstance.post(API_ROUTES.MEMBERSHIP.ENROLL, {userId: user.userId, membershipId});
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
    }
}

export async function GetEMByUserIdMembershipId(userId: string | number, membershipId: string | number) {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.MEMBERSHIP.ENROLLED.USER}/${userId}/membership/${membershipId}`);
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
    }
}

export async function GetCreatorByUserName(userName: string) {
    try {
        const response = await axiosInstance.get<TCreator>(API_ROUTES.CREATOR.USERNAME + userName);
        return response.data;
    } catch (e) {
        return null
    }
}

export async function GetPostsByUsername(userName: string) {
    try {
        const response = await axiosInstance.get<Post[]>(`${API_ROUTES.POST.USER}/${userName}`);
        return response.data;
    } catch {


        return []
    }
}

export async function GetCreatorMembershipByCreatorId(creatorId: string | number) {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.MEMBERSHIP.CREATOR.BASE}/${creatorId}`);
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
    }
}

export async function GetCreatorActiveDonationGoal(creatorId: number) {

    try {
        const response = await axiosInstance.get<TDonationGoal>(`${API_ROUTES.DONATION.GOAL.ACTIVE}/${creatorId}`);
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data.message);
        }
        throw new Error("Error fetching active donation goal");
    }
}