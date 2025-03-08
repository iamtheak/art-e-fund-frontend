// app/(pages)/view-donations/@creator/page.tsx
import { DonationTable } from "@/app/(pages)/view-donations/donation-table";
import { getUserFromSession } from "@/global/helper";
import { getDonationsForCreator } from "../action";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

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
      <h1 className="text-xl font-bold mb-4">View your donations from your fans!</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <DonationTable creatorId={creatorId} />
      </HydrationBoundary>
    </div>
  );
}