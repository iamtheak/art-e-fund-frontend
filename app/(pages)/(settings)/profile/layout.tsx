import {ReactNode, Suspense} from "react";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {getUserFromSession} from "@/global/helper";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default async function ProfileLayout({
                                                user,
                                                creator,
                                            }: {
    user: ReactNode;
    creator: ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const userData = await getUserFromSession();
    const isCreator = userData?.creatorId !== undefined && userData?.creatorId !== null;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Your profile</h1>

            <div className="flex flex-col space-y-6">
                <Tabs defaultValue="user" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="user">User Profile</TabsTrigger>
                        {isCreator && (
                            <TabsTrigger value="creator">Creator Profile</TabsTrigger>
                        )}
                    </TabsList>

                    {/* Updated className for theme compatibility */}
                    <TabsContent value="user" className="mt-6 bg-background p-6 rounded-lg shadow">
                        <Suspense fallback={<div>Loading user profile...</div>}>
                            {user}
                        </Suspense>
                    </TabsContent>

                    {isCreator && (
                        // Updated className for theme compatibility
                        <TabsContent value="creator" className="mt-6 bg-background p-6 rounded-lg shadow">
                            <Suspense fallback={<div>Loading creator profile...</div>}>
                                {creator}
                            </Suspense>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
}