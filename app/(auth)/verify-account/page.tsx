// app/(auth)/verify-account/page.tsx
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {AxiosError} from "axios";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {resendVerificationLinkStrict} from "./action"; // Import the action

interface VerifyAccountPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

async function verifyToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await axiosInstance.post(
            API_ROUTES.AUTH.VERIFY_ACCOUNT,
            {token}
        );
        return {success: true, message: response.data?.message || "Account verified successfully!"};
    } catch (ex) {
        let errorMessage = "Account verification failed.";
        if (ex instanceof AxiosError) {
            console.error("Verification Error:", ex.response?.data);
            errorMessage = ex.response?.data?.message || ex.response?.data || errorMessage;
        } else {
            console.error("Unknown Verification Error:", ex);
        }
        return {success: false, message: errorMessage};
    }
}

export default async function VerifyAccountPage({searchParams}: VerifyAccountPageProps) {
    // Ensure searchParams is treated correctly even in edge cases
    const params = await searchParams || {};
    const token = params?.token;
    let verificationResult: { success: boolean; message: string } | null = null;
    let currentToken: string | null = null; // Store token for the resend button

    if (typeof token === "string" && token.length > 0) {
        currentToken = token; // Store the token
        verificationResult = await verifyToken(token);
    } else {
        verificationResult = {success: false, message: "Invalid or missing verification token."};
    }

    return (
        <div className="w-full flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
                <h1 className="mb-6 text-2xl font-bold">Account Verification</h1>
                {verificationResult ? (
                    <>
                        <p className={`mb-6 text-lg ${verificationResult.success ? 'text-green-600' : 'text-red-600'}`}>
                            {verificationResult.message}
                        </p>
                        {verificationResult.success ? (
                            <Button asChild>
                                <Link href="/login">Proceed to Login</Link>
                            </Button>
                        ) : (
                            <div
                                className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
                                {/* Form for the resend button */}
                                {currentToken && verificationResult.message !== "User not found" && ( // Only show resend if there was a token initially
                                    <form action={resendVerificationLinkStrict}>
                                        <input type="hidden" name="token" value={currentToken}/>
                                        <Button type="submit" variant="secondary">
                                            Resend Verification Link
                                        </Button>
                                    </form>
                                )}
                                <Button asChild variant="outline">
                                    <Link href="/login">Back to Login</Link>
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-red-600">Could not process verification request.</p>
                )}
            </div>
        </div>
    );
}