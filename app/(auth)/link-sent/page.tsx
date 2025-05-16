import Link from "next/link";

export default function LinkSent() {

    return (
        <div className="w-full flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-4 text-center text-2xl font-bold">
                    Check your email
                </h1>
                <p className="mb-6 text-center text-sm text-gray-600">
                    We have sent you a link to reset your password. Please check your inbox.
                </p>
                <Link href="/login" className="text-blue-500 hover:underline">
                    Click to go back to login
                </Link>
            </div>
        </div>
    )
}