// app/(pages)/dashboard/admin-user-list.tsx
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {GetRecentUsers} from "./action"; // Import data fetching function
import {TUser} from "@/global/types"; // Import user type

export default async function AdminUserList() {
    const recentUsers: TUser[] = await GetRecentUsers();

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Users who recently joined or were active.</CardDescription>
            </CardHeader>
            <CardContent className={"overflow-hidden"}>
                <Table className={"overflow-hidden"}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Role</TableHead>
                            <TableHead className="hidden sm:table-cell">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentUsers && recentUsers.length > 0 ? (
                            recentUsers.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.profilePicture || undefined}
                                                             alt={user.userName}/>
                                                <AvatarFallback>
                                                    {user.firstName ? user.firstName.substring(0, 1).toUpperCase() : ""}
                                                    {user.lastName ? user.lastName.substring(0, 1).toUpperCase() : (!user.firstName && user.userName) ? user.userName.substring(0, 2).toUpperCase() : ""}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">
                                                {user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : user.userName}
                                                <div
                                                    className="text-xs text-muted-foreground hidden sm:block">@{user.userName}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="hidden md:table-cell">{user.role}</TableCell>
                                    <TableCell
                                        className="hidden sm:table-cell">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    No recent users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}