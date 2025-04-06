"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { TEnrolledMembership } from "@/global/types";
import { getCreatorMembers } from "@/app/(pages)/view-memberships/@creator/action";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MembersList({ creatorId }: { creatorId: number | string }) {
  const { data: members, isLoading, error } = useQuery({
    queryKey: ['creator', 'members', creatorId],
    queryFn: () => getCreatorMembers(creatorId),
    staleTime: Infinity,
  });

  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  if (isLoading) return <div className="text-center py-4">Loading members...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Failed to load members</div>;
  if (!members || members.length === 0) return <div className="text-center py-4">No members yet</div>;

  // Filter members based on status
  const filteredMembers = members.filter((member) => {
    if (statusFilter === "all") return true;
    return statusFilter === "active" ? member.isActive : !member.isActive;
  });

  // Group members by membership ID
  const membershipGroups = filteredMembers.reduce((groups: Record<number, TEnrolledMembership[]>, member) => {
    const { membershipId } = member;
    if (!groups[membershipId]) {
      groups[membershipId] = [];
    }
    groups[membershipId].push(member);
    return groups;
  }, {});

  const sortedMembershipIds = Object.keys(membershipGroups).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total: {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
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

      {sortedMembershipIds.map((membershipId) => {
        const membersInGroup = membershipGroups[membershipId];
        const membershipName = membersInGroup[0].membershipName;

        return (
          <Card key={membershipId}>
            <CardHeader>
              <CardTitle>{membershipName} Membership</CardTitle>
              <div className="text-sm text-muted-foreground">
                {membersInGroup.length} member{membersInGroup.length !== 1 ? 's' : ''}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {membersInGroup.map((member) => (
                  <div key={member.enrolledMembershipId} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${member.userName}`} />
                        <AvatarFallback>{member.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined: {format(new Date(member.enrolledDate), 'PPP')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <p className="text-sm mt-1">
                        Expires: {format(new Date(member.expiryDate), 'PPP')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}