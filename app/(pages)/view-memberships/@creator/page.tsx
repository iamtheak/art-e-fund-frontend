import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getUserFromSession} from "@/global/helper";
import {MembershipCards} from "./_components/membership-cards";
import {getCreatorGrowth, getCreatorMemberships} from "./action";
import MembersList from "@/app/(pages)/view-memberships/@creator/_components/members-list";
import MembershipChart from "@/app/(pages)/view-memberships/@creator/_components/membership-chart";

export default async function ViewCreatorMembership() {
    const user = await getUserFromSession();
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['creator', 'memberships'],
        queryFn: () => getCreatorMemberships(user?.userName ?? "")
    });

    await queryClient.prefetchQuery({
        queryKey: ['membership', 'growth', user?.creatorId],
        queryFn: () => getCreatorGrowth(user?.creatorId ?? "")
    })

    return (
        <div className="w-full flex flex-col gap-6  mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Membership Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your memberships and view subscriber details</p>
                </div>
            </div>

            <Tabs defaultValue="memberships" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="memberships">Your Memberships</TabsTrigger>
                    <TabsTrigger value="subscribers">All Subscribers</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="memberships" className="space-y-4">
                    <div>
                        <HydrationBoundary state={dehydrate(queryClient)}>
                            <MembershipCards userName={user?.userName ?? ""}/>
                        </HydrationBoundary>
                    </div>
                </TabsContent>

                <TabsContent value="subscribers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscribers</CardTitle>
                            <CardDescription>View and manage your subscribers across all membership
                                tiers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <MembersList creatorId={user?.creatorId ?? 0}/>
                            </HydrationBoundary>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <MembershipChart creatorId={user?.creatorId ?? 0}/>
                    </HydrationBoundary>
                </TabsContent>
            </Tabs>
        </div>
    );
}