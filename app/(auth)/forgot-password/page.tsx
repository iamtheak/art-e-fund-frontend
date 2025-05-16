// app/(auth)/forgot-password/page.tsx
import {ForgotPasswordForm} from "./forgot-password-form"; // Import the new form component

export default function ForgotPasswordPage() {
    return (
        <div className="w-full flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-4 text-center text-2xl font-bold">
                    Forgot Password
                </h1>
                <p className="mb-6 text-center text-sm text-gray-600">
                    Enter your email address below and we&#39;ll send you a link to reset
                    your password.
                </p>
                <ForgotPasswordForm/> {/* Render the form component */}
            </div>
        </div>
    );
}