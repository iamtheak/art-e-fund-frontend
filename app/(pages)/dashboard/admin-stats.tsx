// app/(pages)/dashboard/admin-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, UserCheck } from "lucide-react";
import {
    GetTotalUsers,
    GetTotalDonations,
    GetTotalCreators
} from "./action"; // Import data fetching functions

export default async function AdminStats() {
    // Fetch all data concurrently
    const [
        totalUsers,
        totalDonations,
        totalCreators
    ] = await Promise.all([
        GetTotalUsers(),
        GetTotalDonations(),
        GetTotalCreators()
    ]);

    return (
        <section className="grid gap-6 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Registered users on the platform</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    <DollarSign className="h-5 w-5 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rs. {totalDonations.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</div>
                    <p className="text-xs text-muted-foreground">Total amount donated</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
                    <UserCheck className="h-5 w-5 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCreators.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Verified creators</p>
                </CardContent>
            </Card>
        </section>
    );
}