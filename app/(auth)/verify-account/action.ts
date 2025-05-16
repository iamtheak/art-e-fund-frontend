// app/(auth)/verify-account/action.ts
"use server";

import axiosInstance from "@/config/axios";
import { API_ROUTES } from "@/config/routes";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export async function resendVerificationLinkStrict(formData: FormData) {
    const token = formData.get("token") as string;
    let success = false; // Flag to track API call success

    if (!token) {
        console.error("Resend Verification: Token missing.");
        // Redirect immediately if the token is invalid/missing before API call
        redirect("/login?error=resend_failed_token");
        return; // Exit function
    }

    try {
        // Attempt the API call
        await axiosInstance.post(API_ROUTES.AUTH.RESEND_VERIFICATION, { token });
        // If the API call succeeds without throwing, mark as success
        success = true;
    } catch (ex) {
        // Log the actual error from the API call
        console.error(
          "Resend Verification API Error:",
          ex instanceof AxiosError ? ex.response?.data : ex
        );
        // success remains false
    }

    // Perform redirect *after* the try...catch block
    if (success) {
        // Redirect to verification-sent page on successful API call
        redirect("/verification-sent");
    } else {
        // Redirect to login page indicating the API call failed
        redirect(`/login?error=resend_api_failed`);
    }
}