import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DollarSign, Eye, Users} from "lucide-react";
import {getHeaderStats} from "@/app/(pages)/home/action"; // Using lucide-react icons


async function getCreatorStats() {
    await new Promise(resolve => setTimeout(resolve, 500));

    const stats = await getHeaderStats()
    return {
        totalMembers: stats.totalMembers,
        totalDonations: stats.totalDonations,
        totalProfileViews: stats.totalProfileViews,
    }
}

export default async function HomeHeader() {
    const stats = await getCreatorStats();

    return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3     p-4">
            {/* Total Members Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Members
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString('en-US')}</div>
                </CardContent>
            </Card>

            {/* Total Donations Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Donations
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    {/* Format as currency */}
                    <div className="text-2xl font-bold">
                        Rs. {stats.totalDonations.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                    </div>
                    {/* <p className="text-xs text-muted-foreground">+12.1% from last month</p> */}
                </CardContent>
            </Card>

            {/* Total Profile Views Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProfileViews.toLocaleString('en-US')}</div>
                    {/* <p className="text-xs text-muted-foreground">+8% from last month</p> */}
                </CardContent>
            </Card>
        </div>
    );
}