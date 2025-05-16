// app/(pages)/home/_components/new-members.tsx
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {formatDistanceToNow} from "date-fns";
import {getNewMembersAction} from "@/app/(pages)/home/action"; // Use Badge for tier

// Define the structure for a new member
export type NewMember = {
    id: string;
    name: string;
    avatarUrl: string | null;
    membershipTier: number; // e.g., "Bronze", "Silver", "Gold"
    joinDate: Date; // Optional: Could be used for sorting or display
    membershipName: string;
};


export default async function NewMembers() {
    const members = await getNewMembersAction();

    return (
        <Card> {/* Handle spacing in parent grid */}
            <CardHeader>
                <CardTitle>New Members</CardTitle>
                {/* <CardDescription>Recently joined members.</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
                {members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No new members recently.</p>
                ) : (
                    members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    {member.avatarUrl ? (
                                        <AvatarImage src={member.avatarUrl} alt={member.name}/>
                                    ) : null}
                                    <AvatarFallback>
                                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        {member.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Joined {formatDistanceToNow(member.joinDate, {addSuffix: true})}
                                    </p>
                                </div>
                            </div>
                            <p>
                                Tier {member.membershipTier}
                            </p>
                            {/* Display Membership Tier using Badge */}
                            <Badge variant="secondary">{member.membershipName}</Badge>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}