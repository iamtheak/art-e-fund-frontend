// app/(pages)/(settings)/profile/@creator/page.tsx
import {getUserFromSession} from "@/global/helper";
import {CreatorForm} from "./creator-form";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getCreatorById} from "@/app/(pages)/view-memberships/action";
import {getFollowers} from "@/app/[username]/action";
import FollowerList from "./follower-list"; // Import the FollowerList component

export default async function CreatorProfilePage() {
    const queryClient = new QueryClient();
    const userData = await getUserFromSession();

    if (userData === null || userData?.creatorId === undefined) {
        // Consider a more user-friendly message or redirect
        return <div className="p-4 text-center text-gray-600">Creator profile not available or user not logged
            in.</div>;
    }

    const creatorId = userData.creatorId;

    // Prefetch creator data
    const creatorQueryKey = ['creator', 'profile', creatorId];
    await queryClient.prefetchQuery({
        queryKey: creatorQueryKey,
        queryFn: async () => getCreatorById(creatorId),
    });

    // Prefetch follower data
    const followersQueryKey = ['followers', creatorId];
    await queryClient.prefetchQuery({
        queryKey: followersQueryKey,
        queryFn: async () => getFollowers(creatorId),
    });

    // Optionally, check if creator data was fetched successfully before rendering
    const creator = queryClient.getQueryData(creatorQueryKey);
    if (!creator) {
        // This might indicate an issue fetching the creator data
        return <div className="p-4 text-center text-red-600">Failed to load creator profile data.</div>;
    }

    return (
        <div className="space-y-6"> {/* Add spacing between components */}
            <h2 className="text-xl font-semibold mb-4">Creator Profile </h2>
            <HydrationBoundary state={dehydrate(queryClient)}>
                {/* Render the Follower List */}
                <FollowerList creatorId={creatorId}/>
                {/* Render the Creator Form */}
                <div className="mt-6 bg-white shadow-md rounded-lg p-6">

                    <CreatorForm creatorId={creatorId}/>
                </div>

            </HydrationBoundary>
        </div>
    );
}