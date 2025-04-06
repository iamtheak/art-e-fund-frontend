// app/(pages)/view-memberships/page.tsx
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import UserMemberships from "./_components/user-memberships";
import {getEMByUserId} from "./action";
import {getUserFromSession} from "@/global/helper";
import {signOut} from "@/auth";

export default async function ViewUserMemberships() {
    const user = await getUserFromSession();

    if(!user) {
        await signOut()
    }

    const userId = user?.userId;

    const queryClient = new QueryClient();

    if (userId) {
        await queryClient.prefetchQuery({
            queryKey: ["user-memberships", userId],
            queryFn: () => getEMByUserId(userId),
        });
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-2">Your Memberships</h1>
            <p className="text-muted-foreground mb-8">View the memberships that you have subscribed to</p>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <UserMemberships/>
            </HydrationBoundary>
        </div>
    );
}