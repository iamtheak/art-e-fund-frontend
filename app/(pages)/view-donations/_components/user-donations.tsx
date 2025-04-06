// app/(pages)/view-donations/_components/user-donations.tsx
"use client"

import {useQuery} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {format} from "date-fns";
import {TCreator} from "@/global/types";
import {getUserDonationsByUserId} from "../action";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Search} from "lucide-react";
import {TDonation} from "@/app/(pages)/view-donations/donation-table";
import {getCreatorById} from "@/app/(pages)/view-memberships/action";

export default function UserDonations() {
    const {data: session} = useSession();
    const userId = session?.user?.userId;
    const [searchTerm, setSearchTerm] = useState("");

    const {data: donations, isLoading, error} = useQuery({
        queryKey: ["user-donations", userId],
        queryFn: () => getUserDonationsByUserId(userId || 0),
        enabled: !!userId,
        staleTime: Infinity,
    });

    if (isLoading) return <div className="text-center py-4">Loading your donations...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Failed to load donations</div>;
    if (!donations || donations.length === 0) {
        return <div className="text-center py-6">You haven't made any donations yet</div>;
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                    placeholder="Search by creator username"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="text-sm text-muted-foreground">
                Total: {donations.length} donation{donations.length !== 1 ? 's' : ''}
            </div>

            {donations.map((donation) => (
                <DonationCard
                    key={donation.donationId}
                    donation={donation}
                    searchTerm={searchTerm}
                />
            ))}
        </div>
    );
}

function DonationCard({donation, searchTerm}: { donation: TDonation; searchTerm: string }) {
    const {data: creator, isLoading} = useQuery<TCreator>({
        queryKey: ["creator", donation.creatorId],
        queryFn: () => getCreatorById(donation.creatorId),
        staleTime: Infinity,
    });

    // Skip rendering if search is active and this creator doesn't match
    if (searchTerm && creator && !creator.userName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
    }

    if (isLoading || !creator) {
        return (
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage
                                src={creator.profilePicture || `https://avatar.vercel.sh/${creator.userName}`}/>
                            <AvatarFallback>{creator.userName?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Link href={`/${creator.userName}`}>
                                <CardTitle
                                    className="hover:text-primary transition-colors">{creator.userName}</CardTitle>
                            </Link>
                            <p className="text-sm text-muted-foreground">{creator.firstName} {creator.lastName}</p>
                        </div>
                    </div>
                    <div className="text-lg font-bold">Rs {donation.donationAmount}</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium">Donation Date</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(donation.donationDate), "PPP")}</p>
                    </div>
                    {donation.donationMessage && (
                        <div>
                            <p className="text-sm font-medium">Message</p>
                            <p className="text-sm text-muted-foreground">{donation.donationMessage}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}