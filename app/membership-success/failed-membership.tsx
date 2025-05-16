// app/membership-success/failed-membership.tsx
"use client"
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function FailedMembership() {
    const router = useRouter();
    return (
        <div className="flex h-screen justify-center items-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Membership Purchase Failed</h1>
                <p className="my-4">There was an issue processing your membership purchase.</p>
                <Button onClick={() => router.push("/home")}>
                    Go Home
                </Button>
            </div>
        </div>
    )
}