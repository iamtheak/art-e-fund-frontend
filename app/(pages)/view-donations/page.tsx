// app/(pages)/view-donations/page.tsx
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import UserDonations from "./_components/user-donations";
import {getUserDonationsByUserId} from "@/app/(pages)/view-donations/action";
import {getUserFromSession} from "@/global/helper";

export default async function ViewUserDonations() {
    const user = await getUserFromSession();
    const userId = user?.userId;

    const queryClient = new QueryClient();

    if (userId) {
        await queryClient.prefetchQuery({
            queryKey: ["user-donations", userId],
            queryFn: () => getUserDonationsByUserId(userId),
        });
    }

    return (
        <div className="container relative overflow-auto py-8">
            <div className="sticky top-">
                <h1 className="text-3xl font-bold mb-2">Your Donations</h1>
                <p className="text-muted-foreground mb-8">View all the donations you have made to creators</p>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <UserDonations/>
            </HydrationBoundary>
        </div>
    );
}
