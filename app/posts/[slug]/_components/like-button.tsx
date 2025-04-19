// app/posts/[slug]/_components/like-button.tsx
"use client";

import {Button} from "@/components/ui/button";
import {Heart} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {getPostComments, getPostLikes, likePost, unlikePost} from "../action";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Post} from "@/app/(pages)/manage-posts/action";

export function LikeButton({postId, slug, userId}: { postId: number, slug: string, userId: number }) {
    const {toast} = useToast();
    const queryClient = useQueryClient();

    // Get likes from React Query cache
    const {data: likes = []} = useQuery({
        queryKey: ["likes", postId],
        queryFn: () => getPostLikes(postId),
    });
    // Check if the current user has liked the post
    const userLiked = userId ? likes.some(like => like.userId === userId) : false;


    // Like/unlike mutation
    const likeMutation = useMutation({
        mutationFn: () => userLiked ? unlikePost(postId) : likePost(postId),
        onMutate: async () => {
            // Optimistic update
            await queryClient.cancelQueries({queryKey: ["likes", postId]});
            const previousLikes = queryClient.getQueryData(["likes", postId]);

            if (userId) {
                if (userLiked) {
                    // Remove like
                    queryClient.setQueryData(
                        ["likes", postId],
                        likes.filter(like => like.userId !== userId)
                    );
                } else {
                    // Add like
                    const newLike = {
                        likeId: Date.now(),
                        postId,
                        userId,
                        likedAt: new Date().toISOString(),
                        userName: "You",
                        userProfilePicture: "",
                    };
                    queryClient.setQueryData(["likes", postId], [...likes, newLike]);
                }
            }

            // Also update the post like count
            const post = queryClient.getQueryData<Post>(["post", slug]);
            if (post) {

                queryClient.setQueryData(["post", slug], {
                    ...post,
                    likesCount: userLiked ? post.likesCount - 1 : post.likesCount + 1,
                });
            }

            return {previousLikes};
        },
        onError: (err, variables, context) => {
            // Revert on error
            if (context?.previousLikes) {
                queryClient.setQueryData(["likes", postId], context.previousLikes);
            }
            toast({
                title: "Error",
                description: "Failed to update like status",
                variant: "destructive",
            });
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({queryKey: ["likes", postId]});
            queryClient.invalidateQueries({queryKey: ["post", postId]});
        },
    });

    return (
        <Button
            variant={userLiked ? "default" : "outline"}
            size="lg"
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending || !userId}
            className="gap-2"
        >
            <Heart size={20} className={userLiked ? "fill-white" : ""}/>
            {userLiked ? "Liked" : "Like this post"}
        </Button>
    );
}