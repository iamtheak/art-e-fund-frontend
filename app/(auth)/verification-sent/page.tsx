import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import Link from "next/link";

export default function VerificationSent() {
    return (
        <div className={"w-full flex flex-col items-center justify-center"}>
            <Card className="flex flex-col items-center justify-center dark:bg-slate-900 dark:text-slate-50 p-6 shadow-lg">
                <CardHeader>
                    <h1 className="text-2xl font-bold">Verification Email Sent</h1>
                </CardHeader>
                <CardContent>
                    <p className="mt-4 text-gray-600">
                        Please check your email for a verification link.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href={"/login"} className="text-blue-500 hover:underline">
                        Go back to login
                    </Link>
                </CardFooter>
            </Card>
        </div>

    );
}