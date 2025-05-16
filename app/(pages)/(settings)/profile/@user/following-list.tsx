// app/(pages)/(settings)/profile/@user/following-list.tsx
"use client";

import * as React from 'react';
import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {TFollower} from '@/global/types';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Loader2, UserCheck, ChevronDown, ChevronUp} from 'lucide-react'; // Changed icon to UserCheck
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {getFollowingList} from "@/app/[username]/action";

interface FollowingListProps {
    userId: number; // Pass the ID of the user whose following list we want
}

export default function FollowingList({userId}: FollowingListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const {data: following, isLoading, error} = useQuery<TFollower[], Error>({
        // Use a distinct query key for following list
        queryKey: ['following', userId],
        queryFn: () => getFollowingList(userId),
        enabled: !!userId, // Only run query if userId is valid
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const followingCount = following?.length ?? 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                    <UserCheck className="mr-2 h-5 w-5 text-gray-600"/> {/* Updated Icon */}
                    Following ({isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-1"/> : followingCount})
                </CardTitle>
                {followingCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={toggleExpand} aria-expanded={isExpanded}>
                        {isExpanded ? 'Hide' : 'Show'} List
                        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isLoading && !following && (
                    <div className="text-sm text-gray-500 flex items-center justify-center py-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Loading following list...
                    </div>
                )}
                {error && (
                    <p className="text-sm text-red-600 text-center py-4">Failed to load following list.</p>
                )}
                {!isLoading && !error && followingCount === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">You are not following anyone yet.</p>
                )}
                {isExpanded && following && followingCount > 0 && (
                    <ul className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
                        {following.map((followedUser) => (
                            // Use creatorId as key assuming it's the unique ID of the followed entity
                            <li key={followedUser.creatorId} className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={followedUser.followingAvatarUrl ?? undefined}
                                                 alt={`${followedUser.followingUserName}'s avatar`}/>
                                    <AvatarFallback>
                                        {followedUser.followingUserName?.charAt(0).toUpperCase() ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{followedUser.followingUserName}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}