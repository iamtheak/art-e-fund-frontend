// app/[username]/page.tsx
import Link from "next/link";
import {Icon} from "@iconify/react";
import Donate from "@/app/[username]/_components/donate-box/donate";
import {TCreator} from "@/global/types";
import {GetCreatorActiveDonationGoal, GetCreatorByUserName} from "@/app/[username]/action";
import {notFound} from "next/navigation";
import {getUserFromSession} from "@/global/helper";
import {QueryClient} from "@tanstack/react-query";
import CreatorDonationGoal from "@/app/[username]/_components/donation-goal/donation-goal";
import ToastHandler from "@/app/[username]/_components/toast-handler";

export default async function Page({
                                       params,
                                       searchParams,
                                   }: {
    params: Promise<{ username: string }>
    searchParams: Promise<{ message?: string }>
}) {
    const slug = (await params).username;
    const message = (await searchParams).message;


    let creator: TCreator | null = null;

    const response = await GetCreatorByUserName(slug);

    if (response === undefined) {
        notFound()
    }
    creator = response;
    const user = await getUserFromSession()

    let isSameUser = false;

    if (user) {
        isSameUser = user.userId === creator?.userId;
    }
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['activeDonationGoal', creator?.creatorId],
        queryFn: () => GetCreatorActiveDonationGoal(creator?.creatorId ?? 0),
        staleTime: 5 * 60 * 1000,
    })


    return (
        // Assuming the parent layout `app/[username]/layout.tsx` handles the overall page background
        <div className="container mx-auto px-4 py-6">
            <ToastHandler message={message}/>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column */}
                <div className="w-full lg:w-2/5 space-y-6">
                    {/* Donation Goal Card */}
                    <div className="w-full relative">
                        <CreatorDonationGoal creatorId={creator?.creatorId ?? 0} isSameUser={isSameUser}/>
                    </div>

                    {/* About Creator Card */}
                    {/* Assuming 'bg-mint' is a brand color and should remain consistent */}
                    <div className=" dark:bg-slate-900 rounded-xl p-5 shadow-lg dark:shawdow-white">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                            About {creator?.userName}
                        </h2>

                        <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                            {creator?.creatorDescription}
                        </p>

                    </div>
                </div>

                {/* Right Column */}
                <div className="w-full lg:w-3/5">
                    {!isSameUser ? (
                        <Donate userName={slug} creatorId={creator?.creatorId ?? 0}/>
                    ) : (
                        // Assuming 'bg-gradient-to-r from-mint to-mint/90' are brand colors
                        <div
                            className=" dark:bg-slate-900 rounded-xl p-6 shadow-lg hover:shadow-lg transition-shadow">
                            <div
                                className="flex flex-col sm:flex-row justify-center items-center gap-4 text-center sm:text-left">
                                <Link href={`/manage-posts?create=true`}>
                                    <div className="flex items-center gap-3">

                                        <p className="text-lg font-medium text-slate-800 dark:text-slate-100">
                                            Add your new post to your creator page
                                        </p>
                                        {/* bg-yinmn-blue text-white should offer good contrast in both modes */}
                                        <div
                                            className="bg-yinmn-blue text-white rounded-full p-2 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                                            <Icon icon="mdi:plus" width={24} height={24}/>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}