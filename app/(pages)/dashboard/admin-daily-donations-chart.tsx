// app/(pages)/dashboard/admin-daily-donations-chart.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import DonationChart, { TDonationChartData } from "@/app/(pages)/home/_components/donation-chart";
import { GetDailyDonationsAdmin } from "./action"; // Import data fetching function

export default async function AdminDailyDonationsChart() {
    const donationChartData: TDonationChartData[] = await GetDailyDonationsAdmin();

    return (
        <section>
            {donationChartData && donationChartData.length > 0 ? (
                <DonationChart allChartData={donationChartData} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-6 w-6" />
                            Donation Overview
                        </CardTitle>
                        <CardDescription>Daily donation trends.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                            <p className="text-lg font-semibold">No Donation Data Available</p>
                            <p>There is no data to display the chart at the moment.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </section>
    );
}