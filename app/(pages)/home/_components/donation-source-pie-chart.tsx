// app/(pages)/home/_components/donation-source-pie-chart.tsx
"use client";

import * as React from "react";
import {useMemo} from "react";
import {Pie, PieChart, Cell, ResponsiveContainer} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
// Donator type is no longer needed here unless used for something else

// Define chart configuration with specific colors
const chartConfig = {
    user: {
        label: "User Donations",
        color: "hsl(var(--chart-1))", // Example color
    },
    anonymous: {
        label: "Anonymous Donations",
        color: "hsl(var(--chart-2))", // Example color
    },
};

// Define the expected props structure
export type DonationSourceData = {
    userTotal: number;
    anonymousTotal: number;
};

type DonationSourcePieChartProps = {
    donationSourceData: DonationSourceData;
};

export default function DonationSourcePieChart({donationSourceData}: DonationSourcePieChartProps) {
    const {userTotal, anonymousTotal} = donationSourceData;
    const totalDonations = userTotal + anonymousTotal;

    // Prepare data for the pie chart directly from props
    const pieData = useMemo(() => {
        const data = [
            {name: chartConfig.user.label, value: userTotal, fill: chartConfig.user.color},
            {name: chartConfig.anonymous.label, value: anonymousTotal, fill: chartConfig.anonymous.color},
        ];
        // Filter out segments with zero value
        return data.filter(item => item.value > 0);
    }, [userTotal, anonymousTotal]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Donation Sources</CardTitle>
                <CardDescription>User vs. Anonymous Contributions</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-0">
                {totalDonations === 0 || pieData.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-10">No donation data available.</p>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[200px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent
                                        hideLabel
                                        formatter={(value, name) => [`Rs. ${Number(value).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })} (${totalDonations > 0 ? ((Number(value) / totalDonations) * 100).toFixed(1) : 0}%)`, name]}
                                    />}
                                />
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    labelLine={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-1 text-sm mt-4 items-center">
                {/* Render legend items only if their value is > 0 */}
                {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 leading-none">
                        <span className="h-2 w-2 rounded-full" style={{backgroundColor: entry.fill}}/>
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span>Rs. {entry.value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}</span>
                    </div>
                ))}
                {totalDonations > 0 && ( // Show total only if there are donations
                    <div className="font-semibold mt-2 pt-2 border-t w-full text-center">
                        Total: Rs. {totalDonations.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}