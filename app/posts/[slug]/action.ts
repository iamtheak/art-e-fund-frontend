// app/posts/[slug]/actions.ts
"use server"

import {API_ROUTES} from "@/config/routes";
import axiosInstance from "@/config/axios";
import {Post} from "@/app/(pages)/manage-posts/action";
import {getUserFromSession} from "@/global/helper";
import {AxiosError} from "axios";

export type Comment = {
    commentId: number;
    commentText: string;
    commentedAt: string;
    userId: number;
    userName: string;
    userProfilePicture: string;
};

export type Like = {
    likeId: number;
    postId: number;
    userId: number;
    likedAt: string;
    userName: string;
    userProfilePicture: string;
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<Post> {
    try {
        console.log(slug);
        const response = await axiosInstance.get(`${API_ROUTES.POST.SLUG}/${slug}`);
        return response.data;
    } catch (error) {
        return {} as Post;
    }
}

export async function getPostViewAccess(postId: number, userId: number): Promise<boolean> {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.POST.BASE}/${postId}/view/${userId}`);
        return response.data;
    } catch (error) {

        console.log(error.config)
        return false;
    }
}

// Get post comments
export async function getPostComments(postId: number): Promise<Comment[]> {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.POST.COMMENT.POST}/${postId}`);
        return response.data;
    } catch (error) {
        return []
    }
}

// Add comment
export async function addComment(postId: number, commentText: string): Promise<Comment> {

    const user = await getUserFromSession();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const userId = user.userId;
    try {
        const response = await axiosInstance.post(API_ROUTES.POST.COMMENT.BASE, {
            postId,
            commentText,
            userId,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to add comment");
    }
}

// Like post
export async function likePost(postId: number): Promise<void> {
    const user = await getUserFromSession();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const userId = user.userId;

    try {
        await axiosInstance.post(`${API_ROUTES.POST.BASE}/like`, {
            postId,
            userId
        });
    } catch (error) {
        throw new Error("Failed to like post");
    }
}

// Unlike post
export async function unlikePost(postId: number): Promise<void> {
    const user = await getUserFromSession();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const userId = user.userId;
    try {
        await axiosInstance.delete(`${API_ROUTES.POST.BASE}/like/${postId}/${userId}`);
    } catch (error) {
        throw new Error("Failed to unlike post");
    }
}

export async function getPostLikes(postId: number): Promise<Like[]> {
    try {
        const response = await axiosInstance.get(`${API_ROUTES.POST.LIKE.POST}/${postId}`);
        return response.data;
    } catch {
        return []
    }
}

export async function addPostView(postId: number) {
    try {
        await axiosInstance.post(`${API_ROUTES.POST.BASE}/view?postId=${postId}`);
    } catch {
        return false;
    }
}