"use server"
// app/(pages)/manage-posts/actions.ts
import {API_ROUTES} from "@/config/routes";
import axiosInstance from "@/config/axios";
import {AxiosError} from "axios";
import {v2 as cloudinary} from "cloudinary";
import {getUserFromSession} from "@/global/helper";

export type Post = {
    postId: number;
    postSlug: string;
    title: string;
    content: string;
    imageUrl: string;
    isMembersOnly: boolean;
    membershipTier: number;
    views: number;
    createdAt: string;
    updatedAt: string;
    creatorId: number;
    creatorName: string;
    creatorProfilePicture: string;
    likesCount: number;
    commentsCount: number;
    isDeleted: boolean;
};

export type CreatePostInput = {
    title: string;
    content: string;
    imageUrl: string;
    isMembersOnly: boolean;
    membershipTier: number;
};


cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadPostImage(file: File | null, postSlug?: string) {
    if (file === null) {
        throw new Error("No file to upload");
    }

    const user = await getUserFromSession();
    if (!user) {
        throw new Error("User not authenticated");
    }
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileStr = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${fileStr}`;

        // Generate a unique identifier if we don't have a postSlug yet
        const publicId = postSlug
            ? `posts/${postSlug}_image`
            : `posts/temp_${Date.now().toString()}`;

        const response = await cloudinary.uploader.upload(fileUri, {
            folder: `${user.userId}`,
            resource_type: "image",
            overwrite: true,
            transformation: [
                {width: 1200, height: 675, crop: "fill"},
                {quality: "auto"},
            ],
            public_id: publicId,
        });

        return response.secure_url;
    } catch {
        throw new Error("Error uploading post image ");
    }
}

// Fetch creator's posts
export const getPosts = async (creatorId: number): Promise<Post[]> => {

    const response = await axiosInstance.get<Post[]>(API_ROUTES.POST.CREATOR + "/" + creatorId);
    return response.data;

};

// Create new post
export const createPost = async (post: CreatePostInput): Promise<Post> => {
    const response = await axiosInstance.post<Post>(API_ROUTES.POST.BASE, post);
    return response.data;
};

// Update existing post
export const updatePost = async (postId: number, post: CreatePostInput): Promise<Post> => {

    try {

        const response = await axiosInstance.put(`${API_ROUTES.POST.BASE}/${postId}`, post);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response?.data);
            console.log(error.config);
        }
        throw error;
    }
};

// Delete post
export const deletePost = async (postId: number): Promise<void> => {
    await axiosInstance.delete(`${API_ROUTES.POST.BASE}/${postId}`);
};

// Get single post by id
export const getPostById = async (postId: number): Promise<Post> => {
    const response = await axiosInstance.get(`${API_ROUTES.POST.BASE}/${postId}`);
    return response.data;
};