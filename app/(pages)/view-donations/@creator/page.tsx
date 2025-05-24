// app/(pages)/view-donations/@creator/page.tsx
import {DonationTable} from "@/app/(pages)/view-donations/donation-table";
import {getUserFromSession} from "@/global/helper";
import {getDonationsForCreator} from "../action";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import ViewDonationGoal from "@/app/(pages)/view-donations/_components/view-donation-goal";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default async function Page() {
    const user = await getUserFromSession();
    const creatorId = user?.creatorId ?? 0;

    // Create a new QueryClient for server prefetching
    const queryClient = new QueryClient();

    // Prefetch donations data
    await queryClient.prefetchQuery({
        queryKey: ['donations', creatorId],
        queryFn: () => getDonationsForCreator(creatorId)
    });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">View your donations from your fans!</h1>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <DonationTable creatorId={creatorId}/>
            </HydrationBoundary>
            <Card className="flex flex-col justify-center mt-4 relative">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Donation Goals</CardTitle>
                    <p className="text-sm text-muted-foreground">View and manage your donation goals</p>
                </CardHeader>
                <CardContent className="px-4 py-4 w-full h-full">
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <ViewDonationGoal creatorId={creatorId}/>
                    </HydrationBoundary>
                </CardContent>
            </Card>
        </div>
    );
}