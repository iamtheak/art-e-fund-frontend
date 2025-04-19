"use client";

import { useQuery } from "@tanstack/react-query";
import { GetCreatorActiveDonationGoal } from "@/app/[username]/action";
import { Progress } from "@/components/ui/progress";
import { TDonationGoal } from "@/app/(pages)/view-donations/_components/validator";
import Loader from "@/components/loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

interface CreatorDonationGoalProps {
  creatorId: number;
  isSameUser?: boolean;
}

export default function CreatorDonationGoal({ creatorId , isSameUser }: CreatorDonationGoalProps) {
  const {
    data: donationGoal,
    isLoading,
    error
  } = useQuery<TDonationGoal>({
    queryKey: ['activeDonationGoal', creatorId],
    queryFn: () => GetCreatorActiveDonationGoal(creatorId),
    enabled: !!creatorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <Loader size={20} text="Loading goal..." />;
  }

  if (error || !donationGoal) {
    return null;
  }

  const progressPercentage = (donationGoal.goalProgress / donationGoal.goalAmount) * 100;
  const formattedProgress = Math.min(Math.round(progressPercentage),100);

  return (
    <Card className="w-full border-none shadow-md bg-gradient-to-br from-mint to-mint/80 rounded-xl overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center gap-2 sm:gap-3">
        <HeartHandshake className="h-4 w-4 sm:h-5 sm:w-5 text-yinmn-blue" />
        <h3 className="font-semibold text-base sm:text-lg">{isSameUser ? "Your Donation Goal" : "Support Our Creator Goal"}</h3>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-5 px-4 sm:px-6">
        <h4 className="font-medium text-sm sm:text-base mb-1 sm:mb-1.5">{donationGoal.goalTitle}</h4>
        <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-slate-700 line-clamp-3">{donationGoal.goalDescription}</p>

        <div className="relative mb-1.5">
          <Progress
            value={progressPercentage}
            className="h-2 sm:h-3 bg-white/70"
            style={{
              background: "rgba(255,255,255,0.5)",
              borderRadius: "4px"
            }}
          />
          <div
            className="absolute h-2 sm:h-3 rounded-full bg-gradient-to-r from-yinmn-blue to-blue-500"
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
              top: 0,
              maxWidth: "100%"
            }}
          />
        </div>

        <div className="flex flex-col xs:flex-row justify-between text-xs sm:text-sm font-medium gap-1 sm:gap-0">
          <span className="text-yinmn-blue">{formattedProgress}% complete</span>
          <span className="text-slate-700 truncate">
            Rs. {donationGoal.goalProgress.toLocaleString()} of Rs. {donationGoal.goalAmount.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}