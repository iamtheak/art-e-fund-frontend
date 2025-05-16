// app/(pages)/home/_components/donation-chart.tsx
"use client";

import * as React from "react";
import {useMemo, useState} from "react";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {DateRange} from "react-day-picker";
import {format, isWithinInterval, parse, startOfDay, subDays} from "date-fns"; // Import date-fns functions
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {DateRangePicker} from "@/components/date-range-picker/date-range-picker"; // Import the picker


const chartConfig = {
    donations: {
        label: "Donations (Rs)",
        color: "hsl(var(--chart-1))",
    },
};

export type TDonationChartData = {
    date: string; // Date in YYYY-MM-DD format
    donations: number; // Amount in dollars
};

// Helper function to parse date string
const parseDateString = (dateStr: string): Date => {
    return parse(dateStr, "yyyy-MM-dd", new Date());
};

export default function DonationChart({allChartData}: { allChartData: TDonationChartData[] }) {


    // State for the selected date range, default to last 30 days
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 29), // Start date 30 days ago
        to: new Date(), // End date today
    });

    // Filter data based on the selected date range
    const filteredData = useMemo(() => {
        if (!dateRange?.from || !dateRange?.to) {
            return allChartData; // Return all data if range is incomplete
        }
        // Ensure 'to' date includes the whole day
        const interval = {start: startOfDay(dateRange.from), end: startOfDay(dateRange.to)};

        return allChartData.filter(item => {
            const itemDate = parseDateString(item.date);
            return isWithinInterval(itemDate, interval);
        }).sort((a, b) => parseDateString(a.date).getTime() - parseDateString(b.date).getTime()); // Sort by date
    }, [dateRange]);

    // Format date for XAxis ticks
    const formatXAxis = (tickItem: string) => {
        // Show month and day for clarity if range is small, otherwise just month/year
        if (dateRange?.from && dateRange?.to) {
            const diffDays = (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays < 90) { // Example threshold: show day if range is less than 3 months
                return format(parseDateString(tickItem), "MMM d");
            }
        }
        return format(parseDateString(tickItem), "MMM yy"); // Default format
    };


    return (
        <Card className="mt-4">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle>Donations Over Time</CardTitle>
                    <CardDescription>
                        {dateRange?.from && dateRange?.to
                            ? `Showing donations from ${format(dateRange.from, "LLL dd, y")} to ${format(dateRange.to, "LLL dd, y")}`
                            : "Select a date range"}
                    </CardDescription>
                </div>
                {/* Add the Date Range Picker */}
                <DateRangePicker
                    date={dateRange}
                    onSelect={(range) => setDateRange(range)} // Update state on selection
                    className="w-full sm:w-auto" // Adjust width for responsiveness
                />
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                            accessibilityLayer
                            data={filteredData} // Use filtered data
                            margin={{
                                left: 12,
                                right: 12,
                                top: 5,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={formatXAxis} // Use the formatter
                                // Optional: Adjust number of ticks if needed
                                // interval="preserveStartEnd"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => `Rs. ${value}`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line"
                                                              formatter={(value, name, props) => [`Rs. ${value}`, `Donations on ${format(parseDateString(props.payload.date), 'MMM d, yyyy')}`]}/>} // Format tooltip
                            />
                            <Line
                                dataKey="donations"
                                type="monotone"
                                stroke={chartConfig.donations.color}
                                strokeWidth={2}
                                dot={true}
                                activeDot={{r: 6}} // Highlight active dot
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* Footer content can be dynamic based on filtered data if needed */}
                <div className="leading-none text-muted-foreground">
                    Total donations in selected period:
                    Rs. {filteredData.reduce((sum, item) => sum + item.donations, 0).toLocaleString()}
                </div>
            </CardFooter>
        </Card>
    );
}
