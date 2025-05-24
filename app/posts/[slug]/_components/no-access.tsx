// app/posts/[slug]/_components/no-access.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function NoAccess() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back(); // Navigate to the previous page
    };

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                        <LockKeyhole className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-semibold">Access Denied</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        You do not have permission to view this content. This might be because it's exclusive to members or subscribers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <Button onClick={handleGoBack} className="mt-6 w-full sm:w-auto">
                        Go Back
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}