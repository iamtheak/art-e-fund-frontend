// app/(pages)/(settings)/profile/@user/page.tsx
import {ProfileForm} from "@/app/(pages)/(settings)/profile/profile-form";
import {auth} from "@/auth";
import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getFollowingList} from "@/app/[username]/action";
import FollowingList from "@/app/(pages)/(settings)/profile/@user/following-list";

export default async function UserProfilePage() {
    const session = await auth();

    if (session === null) {
        return null;
    }

    const user: TProfileFormValues = {
        firstName: session.user.firstName ?? "",
        lastName: session.user.lastName ?? "",
        userName: session.user.userName ?? "",
        email: session.user.email ?? "",
    };

    const client = new QueryClient();

    await client.prefetchQuery({
        queryKey: ["following", session.user.userId],
        queryFn: () => getFollowingList(Number(session?.user?.userId) ?? 0),
    })

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">User Profile</h2>
            <div className={"flex flex-col gap-6"}>

                <HydrationBoundary state={dehydrate(client)}>
                    <FollowingList userId={Number(session?.user?.userId) ?? 0}/>
                </HydrationBoundary>
                <ProfileForm defaultValues={user} originalProfilePicture={session.user.profilePicture ?? ""}/>
            </div>
        </div>
    );
}