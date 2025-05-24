// app/[username]/_components/follow-button/follow-button.tsx
"use client";

import * as React from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {Loader2, UserPlus, UserCheck} from 'lucide-react';
// Assume these actions exist and handle authentication implicitly
import {getFollowStatus, followCreatorAction, unfollowCreatorAction} from '@/app/[username]/action';
import {useToast} from "@/hooks/use-toast";

// Define the expected shape of the data returned by getFollowStatus
interface FollowStatus {
    isFollowing: boolean;
    followerCount: number;
}

// Define the expected shape of the response from follow/unfollow actions
interface FollowActionResult {
    success: boolean;
    newFollowerCount?: number;
}

interface FollowButtonProps {
    creatorId: number;
    isSameUser: boolean;
}

// Helper function to format follower counts
const formatFollowerCount = (count: number | null | undefined): string => {
    if (count === null || count === undefined) return '';
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
};

export default function FollowButton({creatorId, isSameUser}: FollowButtonProps) {
    const queryClient = useQueryClient();
    const queryKey = ['followStatus', creatorId];
    const {toast} = useToast();

    // Fetch initial follow status and count
    const {data: followStatus, isLoading: isLoadingStatus, error: statusError} = useQuery<FollowStatus, Error>({
        queryKey: queryKey,
        queryFn: () => getFollowStatus(creatorId),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
    });

    // Mutation for following a creator
    const {mutate: followMutate, isPending: isFollowingPending} = useMutation<FollowActionResult, Error, void>({
        mutationFn: () => followCreatorAction(creatorId),
        onSuccess: (data) => {
            // Invalidate and refetch the status query to get the latest state
            // Or update query data directly if API returns new count
            queryClient.setQueryData<FollowStatus>(queryKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                    isFollowing: true,
                    followerCount: data.newFollowerCount ?? oldData.followerCount + 1,
                };
            });
            // Optionally invalidate other queries that depend on follower count
        },
        onError: (error) => {
            console.error("Failed to follow creator:", error);
            // TODO: Add user feedback (e.g., toast notification)
        },
    });

    // Mutation for unfollowing a creator
    const {mutate: unfollowMutate, isPending: isUnfollowingPending} = useMutation<FollowActionResult, Error, void>({
        mutationFn: () => unfollowCreatorAction(creatorId),
        onSuccess: (data) => {
            // Update query data directly
            queryClient.setQueryData<FollowStatus>(queryKey, (oldData) => {
                if (!oldData) return oldData;
                return {
                    isFollowing: false,
                    followerCount: data.newFollowerCount ?? Math.max(0, oldData.followerCount - 1),
                };
            });
        },
        onError: (error) => {
            console.error("Failed to unfollow creator:", error);

            toast({
                title: "Error",
                description: "Failed to unfollow the creator. Please try again.",
                variant: "destructive",
            })
        },
    });

    const handleFollow = () => {
        followMutate();
    };

    const handleUnfollow = () => {
        unfollowMutate();
    };

    // Don't show button if it's the same user, but show follower count if available
    if (isSameUser) {
        return (
            <span className="text-sm text-gray-600">
                {isLoadingStatus ? 'Loading...' : statusError ? 'Error' : `${formatFollowerCount(followStatus?.followerCount)} followers`}
            </span>
        );
    }


    const isMutating = isFollowingPending || isUnfollowingPending;
    const isFollowing = followStatus?.isFollowing ?? false;
    const followerCount = followStatus?.followerCount;

    return (
        <div className="flex items-center gap-3">
            {isFollowing ? (
                <Button
                    variant="outline"
                    onClick={handleUnfollow}
                    disabled={isMutating || isLoadingStatus}
                    size="sm"
                    className="transition-colors"
                >
                    {isMutating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <UserCheck className="mr-2 h-4 w-4"/>
                    )}
                    Following
                </Button>
            ) : (
                <Button
                    onClick={handleFollow}
                    disabled={isMutating || isLoadingStatus}
                    size="sm"
                    className="bg-yinmn-blue hover:bg-blue-700 transition-colors" // Example primary color
                >
                    {isMutating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <UserPlus className="mr-2 h-4 w-4"/>
                    )}
                    Follow
                </Button>
            )}
            <span className="text-sm text-gray-600">
                {isLoadingStatus ? 'Loading...' : statusError ? '' : `${formatFollowerCount(followerCount)} followers`}
            </span>
        </div>
    );
}