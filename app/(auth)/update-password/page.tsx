// app/(auth)/update-password/page.tsx
import { Suspense } from "react";
import { UpdatePasswordForm } from "./update-password-form";

// Optional: Add a loading component for Suspense fallback
function Loading() {
  return <p>Loading form...</p>;
}

export default function UpdatePasswordPage() {
  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Update Your Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter and confirm your new password below.
        </p>
        <Suspense fallback={<Loading />}>
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}