// app/(pages)/view-memberships/_components/user-memberships.tsx
"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {format} from "date-fns";
import {TCreator, TEnrolledMembership} from "@/global/types";
import {getEMByUserId, getCreatorById, endEnrolledMembership} from "../action";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Dispatch, SetStateAction, useState} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import ChangeDialog from "@/app/(pages)/view-memberships/_components/change-dialog";
import {ConfirmationDialog} from "@/components/confirmation-dialog/confirmation-dialog";
import {useToast} from "@/hooks/use-toast";
import {cli} from "yaml/dist/cli";

export default function UserMemberships() {
    const {data: session} = useSession();
    const userId = session?.user?.userId;
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [selectedMembership, setSelectedMembership] = useState<TEnrolledMembership>({} as TEnrolledMembership);
    const [showChangeDialog, setShowChangeDialog] = useState(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);


    const {toast} = useToast();
    const {data: enrolledMemberships, isLoading, error} = useQuery({
        queryKey: ["user-memberships", userId],
        queryFn: () => getEMByUserId(userId || 0),
        enabled: !!userId,
        staleTime: Infinity,
    });

    const client = useQueryClient();

    const endMembership = useMutation({
        mutationFn: (enrolledMembershipId: number) => endEnrolledMembership(enrolledMembershipId),
        onSuccess: async () => {
            setIsConfirmationDialogOpen(false);
            toast({
                title: "Success",
                description: "Membership cancelled successfully",
            })

            await client.invalidateQueries({
                queryKey: ["user-memberships", userId],
            })
        },
        onError: (error) => {
            setIsConfirmationDialogOpen(false);
            toast({
                title: "Error",
                description: "Failed to cancel membership",
                variant: "destructive",
            })
        }
    })
    if (isLoading) return <div className="text-center py-4">Loading your memberships...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Failed to load memberships</div>;
    if (!enrolledMemberships || enrolledMemberships.length === 0) {
        return <div className="text-center py-6">You haven&#39;t subscribed to any memberships yet</div>;
    }

    // Filter memberships based on status
    const filteredMemberships = enrolledMemberships.filter((membership) => {
        if (statusFilter === "all") return true;
        return statusFilter === "active" ? membership.isActive : !membership.isActive;
    });


    return (
        <div className="space-y-6">
            <ConfirmationDialog
                action={async () => await endMembership.mutateAsync(selectedMembership.enrolledMembershipId)}
                description={"Cancel your membership? You will not be refunded"} open={isConfirmationDialogOpen}
                setOpen={setIsConfirmationDialogOpen} title={"Cancel your membership?"} actionVariant={"destructive"}/>

            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Total: {enrolledMemberships.length} membership{enrolledMemberships.length !== 1 ? 's' : ''}
                </div>
                <Tabs
                    defaultValue="all"
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
                    className="w-fit"
                >
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {filteredMemberships.length === 0 ? (
                <div className="text-center py-6">
                    No {statusFilter} memberships found
                </div>
            ) : (
                filteredMemberships.map((membership) => (
                    <MembershipCard key={membership.enrolledMembershipId} membership={membership}
                                    setSelectedMembership={setSelectedMembership}
                                    setShowChangeDialog={setShowChangeDialog} setIsOpen={setIsConfirmationDialogOpen}/>
                ))
            )}
            <ChangeDialog isOpen={showChangeDialog} setIsOpen={setShowChangeDialog}
                          creatorId={selectedMembership?.creatorId ?? 0}
                          currentEM={selectedMembership}/>
        </div>
    );
}

function MembershipCard({membership, setSelectedMembership, setShowChangeDialog, setIsOpen}: {
    membership: TEnrolledMembership,
    setSelectedMembership: Dispatch<SetStateAction<TEnrolledMembership>>,
    setShowChangeDialog: Dispatch<SetStateAction<boolean>>,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
}) {

    const {data: creator, isLoading} = useQuery<TCreator>({
        queryKey: ["creator", membership.creatorId],
        queryFn: () => getCreatorById(membership.creatorId),
        staleTime: Infinity,
    });

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
                    <div className={"space-y-2"}>
                        <Badge variant={membership.isActive ? "default" : "outline"}
                               className={membership.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
                            {membership.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {
                            membership.isActive &&
                            (
                                <div className={"flex gap-5"}>
                                    <Button onClick={() => {
                                        setSelectedMembership(membership);
                                        setShowChangeDialog(true)
                                    }
                                    }>
                                        Upgrade
                                    </Button>
                                    <Button type={"button"} variant={"destructive"} onClick={() => {
                                        setSelectedMembership(membership);
                                        setIsOpen(true)
                                    }}>
                                        Cancel
                                    </Button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-y-3">
                        <div>
                            <p className="text-sm font-medium">Membership</p>
                            <p className="text-sm text-muted-foreground">{membership.membershipName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Amount Paid</p>
                            <p className="text-sm text-muted-foreground">Rs {membership.paidAmount}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Enrolled Date</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(membership.enrolledDate), "PPP")}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Expiry Date</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(membership.expiryDate), "PPP")}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Membership Tier</p>
                            <p className="text-sm text-muted-foreground">{membership.membershipTier}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}