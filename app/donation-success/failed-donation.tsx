"use client"


import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function FailedDonation() {


    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/")
        }, 2000)
    }, [router]);

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-bold mb-4">Donation Failed</h1>
            <p className="text-muted-foreground mb-6">The donation was not successful.</p>
            <Link href="/" className="underline text-primary hover:text-primary/80">
                Click here if you are not redirected
            </Link>
        </div>
    )
}