// app/posts/[slug]/_components/post-container.tsx
"use client";

import {useQuery} from "@tanstack/react-query";
import {addPostView, getPostBySlug, getPostComments, getPostLikes} from "../action";
import {PostDetails} from "./post-details";
import {CommentSection} from "./comment-section";
import {Separator} from "@/components/ui/separator";
import {useEffect} from "react";

export default function PostContainer({slug, userId}: { slug: string, userId: number }) {
    // Query for post data
    const {data: post, isLoading: isLoadingPost} = useQuery({
        queryKey: ["post", slug],
        queryFn: () => getPostBySlug(slug),
    });

    if (isLoadingPost) {
        return <div className="animate-pulse">Loading post...</div>;
    }

    if (!post) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Post not found</h1>
                <p>The post you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }


    return (
        <>
            <PostDetails post={post} userId={userId}/>
            <Separator className="my-8"/>
            <CommentSection userId={userId} slug={post.postSlug} postId={post.postId}/>
        </>
    );
}