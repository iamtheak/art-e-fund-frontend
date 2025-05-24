"use client";

import {useQuery} from "@tanstack/react-query";
import {GetCreatorActiveDonationGoal} from "@/app/[username]/action";
import {Progress} from "@/components/ui/progress";
import {TDonationGoal} from "@/app/(pages)/view-donations/_components/validator";
import Loader from "@/components/loader";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {HeartHandshake} from "lucide-react";
import Link from "next/link";
import {Icon} from "@iconify/react";

interface CreatorDonationGoalProps {
    creatorId: number;
    isSameUser?: boolean;
}

export default function CreatorDonationGoal({creatorId, isSameUser}: CreatorDonationGoalProps) {
    const {
        data: donationGoal,
        isLoading,
        error
    } = useQuery<TDonationGoal>({
        queryKey: ['activeDonationGoal', creatorId],
        queryFn: () => GetCreatorActiveDonationGoal(creatorId),
        enabled: !!creatorId,
        staleTime: 5 * 60 * 1000, // 5 minutes,
        refetchOnWindowFocus: false,
        retry: false,
    });

    if (isLoading) {
        return <Loader size={20} text="Loading goal..."/>;
    }


    if (!donationGoal && isSameUser) {

        return (
            <Link href="/view-donations">
                <div
                    className={"w-full h-[200px] border-none shadow-md dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center"}>
                    <p className="text-slate-800 dark:text-slate-100"> Create your donation goal </p>
                    <div
                        className="bg-yinmn-blue text-white rounded-full p-2 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors ml-5">
                        <Icon icon="mdi:plus" width={24} height={24}/>
                    </div>
                </div>
            </Link>
        )
    }
    if (error || !donationGoal) {
        return null;
    }

    const progressPercentage = (donationGoal.goalProgress / donationGoal.goalAmount) * 100;
    const formattedProgress = Math.min(Math.round(progressPercentage), 100);

    return (
        <Card
            // Assuming 'from-mint to-mint/80' are brand colors and remain consistent
            className="w-full border-none shadow-md dark:bg-slate-900 rounded-xl overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center gap-2 sm:gap-3">
                {/* Assuming 'text-yinmn-blue' is a brand color */}
                <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5 "/>
                {/* Updated text color for dark mode compatibility on mint background */}
                <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-100">
                    {isSameUser ? "Your Donation Goal" : "Support Our Creator Goal"}
                </h3>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-5 px-4 sm:px-6">
                {/* Updated text color for dark mode compatibility on mint background */}
                <h4 className="font-medium text-sm sm:text-base mb-1 sm:mb-1.5 text-slate-800 dark:text-slate-100">
                    {donationGoal.goalTitle}
                </h4>
                {/* Updated text color for dark mode compatibility on mint background */}
                <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-slate-700 dark:text-slate-300 line-clamp-3">
                    {donationGoal.goalDescription}
                </p>

                <div className="relative mb-1.5">
                    <Progress
                        value={progressPercentage}
                        // Assuming 'bg-white/70' or 'rgba(255,255,255,0.5)' provides acceptable contrast on mint background
                        className="h-2 sm:h-3 bg-white/70 dark:bg-white/50" // Adjusted for dark mode, assuming mint is light
                        style={{
                            // Replaced inline style with Tailwind class for better dark mode handling if needed
                            // background: "rgba(255,255,255,0.5)", // This was for light mode
                            borderRadius: "4px"
                        }}
                    />
                    {/* Assuming gradient 'from-yinmn-blue to-blue-500' are brand colors */}
                    <div
                        className="absolute h-2 sm:h-3 rounded-full bg-gradient-to-r from-yinmn-blue to-blue-500"
                        style={{
                            width: `${Math.min(progressPercentage, 100)}%`,
                            top: 0,
                            maxWidth: "100%"
                        }}
                    />
                </div>

                <div
                    className="flex flex-col xs:flex-row justify-between text-xs sm:text-sm font-medium gap-1 sm:gap-0">
                    {/* Assuming 'text-yinmn-blue' is a brand color */}
                    <span className="text-yinmn-blue">{formattedProgress}% complete</span>
                    {/* Updated text color for dark mode compatibility on mint background */}
                    <span className="text-slate-700 dark:text-slate-300 truncate">
                        Rs. {donationGoal.goalProgress.toLocaleString()} of Rs. {donationGoal.goalAmount.toLocaleString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}