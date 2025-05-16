// app/(pages)/(settings)/profile/@creator/follower-list.tsx
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFollowers } from '@/app/[username]/action'; // Adjust import path if needed
import { TFollower } from '@/global/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FollowerListProps {
    creatorId: number;
}

export default function FollowerList({ creatorId }: FollowerListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: followers, isLoading, error } = useQuery<TFollower[], Error>({
        queryKey: ['followers', creatorId],
        queryFn: () => getFollowers(creatorId),
        enabled: !!creatorId, // Only run query if creatorId is valid
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const followerCount = followers?.length ?? 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-600" />
                    Your Followers ({isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-1" /> : followerCount})
                </CardTitle>
                {followerCount > 0 && (
                     <Button variant="ghost" size="sm" onClick={toggleExpand} aria-expanded={isExpanded}>
                        {isExpanded ? 'Hide' : 'Show'} List
                        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isLoading && !followers && (
                    <div className="text-sm text-gray-500 flex items-center justify-center py-4">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading followers...
                    </div>
                )}
                {error && (
                    <p className="text-sm text-red-600 text-center py-4">Failed to load followers.</p>
                )}
                {!isLoading && !error && followerCount === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">You don't have any followers yet.</p>
                )}
                {isExpanded && followers && followerCount > 0 && (
                    <ul className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
                        {followers.map((follower) => (
                            <li key={follower.userId} className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={follower.followerAvatarUrl ?? undefined} alt={`${follower.followerUserName}'s avatar`} />
                                    <AvatarFallback>
                                        {follower.followerUserName?.charAt(0).toUpperCase() ?? '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{follower.followerUserName}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}