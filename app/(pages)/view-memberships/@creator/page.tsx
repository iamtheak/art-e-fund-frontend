import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getUserFromSession } from "@/global/helper";
// import MembersList from "@/components/memberships/MembersList";
// import MembershipMetrics from "@/components/memberships/MembershipMetrics";
import { PlusCircle } from "lucide-react";
import { MembershipCards } from "./_components/membership-cards";
import { getCreatorMemberships } from "./action";

export default async function ViewCreatorMembership() {
  const user = await getUserFromSession();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['creator', 'memberships'],
    queryFn: () => getCreatorMemberships(user?.userName ?? "")
  });

  return (
    <div className="w-full flex flex-col gap-6  mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your memberships and view subscriber details</p>
        </div>
      </div>
      
      {/* <MembershipMetrics userName={user?.userName ?? ""} /> */}
      
      <Tabs defaultValue="memberships" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="memberships">Your Memberships</TabsTrigger>
          <TabsTrigger value="subscribers">All Subscribers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="memberships" className="space-y-4">
          <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <MembershipCards userName={user?.userName ?? ""} />
            </HydrationBoundary>
          </div>
        </TabsContent>
        
        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>View and manage your subscribers across all membership tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <HydrationBoundary state={dehydrate(queryClient)}>
                {/* <MembersList userName={user?.userName ?? ""} /> */}
              </HydrationBoundary>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membership Growth</CardTitle>
              <CardDescription>Track your membership growth over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Add analytics charts/graphs here */}
              <div className="flex items-center justify-center h-full border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">Analytics visualization will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}