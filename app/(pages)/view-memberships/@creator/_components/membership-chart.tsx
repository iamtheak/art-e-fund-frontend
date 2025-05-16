// app/(pages)/view-memberships/@creator/_components/membership-chart.tsx
"use client";

import * as React from "react";
import {useMemo, useState} from "react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from "recharts";
// Import parseISO instead of parse
import {format, parseISO, subDays, startOfDay, isWithinInterval} from "date-fns";
import {DateRange} from "react-day-picker";

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
    ChartConfig,
} from "@/components/ui/chart";
import {useQuery} from "@tanstack/react-query";
import {getCreatorGrowth} from "@/app/(pages)/view-memberships/@creator/action";
import {DateRangePicker} from "@/components/date-range-picker/date-range-picker";

// Define the expected data structure for each point in the chart
export type TMembershipChartData = {
    date: string; // Date in ISO 8601 format
    memberCount: number; // Cumulative number of members on this date
};

// Updated helper function to parse ISO date string
const parseDateString = (dateStr: string): Date => {
    // Use parseISO for standard ISO 8601 formats
    return parseISO(dateStr);
};

// Optional: Define chart config for colors if needed
const chartConfig = {
    members: {
        label: "Members",
        color: "hsl(var(--chart-2))", // Example color, adjust as needed
    },
} satisfies ChartConfig;


export default function MembershipChart({creatorId}: { creatorId: string | number }) {

    const {data: membershipGrowthData} = useQuery<TMembershipChartData[]>({
        queryKey: ["membership", "growth", creatorId],
        queryFn: () => getCreatorGrowth(creatorId),
        refetchOnWindowFocus: false,
    });


    // State for the selected date range, default to last 30 days
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 29), // Start date 30 days ago
        to: new Date(), // End date today
    });

    // Filter data based on the selected date range
    const filteredData = useMemo(() => {
        if (!membershipGrowthData) return [];

        // Map data to include parsed date objects for easier filtering/sorting
        const parsedData = membershipGrowthData.map(item => ({
            ...item,
            parsedDate: parseDateString(item.date) // Parse date here
        })).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()); // Sort by parsed date

        if (!dateRange?.from || !dateRange?.to) {
            return parsedData; // Return sorted data if range is incomplete
        }

        const interval = {start: startOfDay(dateRange.from), end: startOfDay(dateRange.to)};

        return parsedData.filter(item => {
            // Check if the item's parsed date falls within the selected interval
            return isWithinInterval(item.parsedDate, interval);
        });
    }, [membershipGrowthData, dateRange]);

    // Format date for XAxis ticks using the original date string
    const formatXAxis = (tickItem: string) => {
        if (!tickItem) return "";
        const dateObj = parseDateString(tickItem); // Parse the original string for formatting
        // Show month and day for clarity if range is small, otherwise just month/year
        if (dateRange?.from && dateRange?.to) {
            const diffDays = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays < 90) { // Example threshold: show day if range is less than 3 months
                return format(dateObj, "MMM d");
            }
        }
        return format(dateObj, "MMM yy"); // Default format
    };

    // Calculate the change in members over the selected period
    const startMemberCount = filteredData[0]?.memberCount ?? 0;
    const endMemberCount = filteredData[filteredData.length - 1]?.memberCount ?? 0;
    const memberChange = endMemberCount - startMemberCount;

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Membership Growth</CardTitle>
                    <CardDescription>
                        {dateRange?.from && dateRange?.to
                            ? `Showing total members from ${format(dateRange.from, "LLL dd, y")} to ${format(dateRange.to, "LLL dd, y")}`
                            : "Select a date range"}
                    </CardDescription>
                </div>
                <DateRangePicker
                    date={dateRange}
                    onSelect={(range) => setDateRange(range)}
                    className="w-full sm:w-auto"
                />
            </CardHeader>
            <CardContent>
                {filteredData.length === 0 ? (
                    <div className="flex items-center justify-center h-[250px]">
                        <p className="text-muted-foreground">No membership data available for the selected period.</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart
                                accessibilityLayer
                                data={filteredData} // Use the filtered data which now includes parsedDate
                                margin={{left: 12, right: 12, top: 5, bottom: 5}}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="date" // Keep using the original date string for the axis key
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={formatXAxis} // Formatter handles parsing
                                />
                                <YAxis
                                    dataKey="memberCount" // Use memberCount for Y-axis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `${value}`} // Format as plain number
                                    domain={['dataMin', 'dataMax']} // Adjust domain if needed
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            indicator="dot" // Use dot indicator for Area chart
                                            formatter={(value, name, props) => [
                                                `${value} Members`, // Tooltip value
                                                // Parse the date string from payload for tooltip label
                                                `On ${format(parseDateString(props.payload.date), 'MMM d, yyyy')}`
                                            ]}
                                        />
                                    }
                                />
                                <Area
                                    dataKey="memberCount"
                                    type="monotone"
                                    fill={chartConfig.members.color} // Use color from config
                                    fillOpacity={0.4}
                                    stroke={chartConfig.members.color}
                                    strokeWidth={2}
                                    dot={false} // Optionally hide dots
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {filteredData.length > 0 && (
                    <div className="leading-none text-muted-foreground">
                        {memberChange >= 0 ? `+${memberChange}` : memberChange} members during this period
                        (Total: {endMemberCount})
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}