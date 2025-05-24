// app/(auth)/forgot-password/page.tsx
import {ForgotPasswordForm} from "./forgot-password-form";
import Link from "next/link"; // Import the new form component

export default function ForgotPasswordPage() {
    return (
        <div className="w-full flex min-h-screen flex-col items-center justify-center  p-4">
            <div className="w-full max-w-sm rounded-lg  dark:bg-slate-900 dark:text-slate-50 p-6 shadow-lg">
                <h1 className="mb-4 text-center text-2xl font-bold">
                    Forgot Password
                </h1>
                <p className="mb-6 text-center text-sm text-gray-600">
                    Enter your email address below and we&#39;ll send you a link to reset
                    your password.
                </p>
                <ForgotPasswordForm/>

                <Link href="/login" className="text-blue-500 pt-5 hover:underline">Back To Login</Link>
            </div>
        </div>
    );
}