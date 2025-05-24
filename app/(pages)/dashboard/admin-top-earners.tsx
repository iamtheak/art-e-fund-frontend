// app/(pages)/dashboard/admin-top-earners.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GetTopEarners } from "./action"; // Import data fetching function

// Define the expected structure for a top earner
// Adjust this based on the actual data returned by GetTopEarners
export interface CreatorEarning {
    creatorId: string; // Assuming creatorId is unique and can be used as a key
    name: string;
    profilePicture?: string; // Optional profile picture
    totalEarnings: number;
    // currencySymbol?: string; // Optional: if you want to display currency symbol
}

export default async function AdminTopEarners() {
    const topEarners: CreatorEarning[] = await GetTopEarners();

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Top Earners</CardTitle>
                <CardDescription>Creators with the highest earnings.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topEarners && topEarners.length > 0 ? (
                        topEarners.map((earner) => (
                            <div
                                key={earner.creatorId}
                                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={earner.profilePicture || undefined} alt={earner.name} />
                                        <AvatarFallback>
                                            {earner.name ? earner.name.substring(0, 2).toUpperCase() : "NA"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{earner.name}</p>
                                        {/* Optional: Display Creator ID or other info */}
                                        {/* <p className="text-sm text-muted-foreground">ID: {earner.creatorId}</p> */}
                                    </div>
                                </div>
                                <p className="font-bold text-lg">
                                    {/* {earner.currencySymbol || "Rs."} */}
                                    Rs. {earner.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">
                            No top earners found.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}