// app/(auth)/update-password/action.ts
"use server";

import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {AxiosError} from "axios";
import {TUpdatePassword} from "./types";

export async function updatePassword(
    data: TUpdatePassword & { token: string }
) {
    try {
        const response = await axiosInstance.post<boolean>(
            API_ROUTES.AUTH.RESET_PASSWORD,
            {
                token: data.token,
                password: data.newPassword,
                confirmPassword: data.confirmPassword,
            }
        );
        return response.data; // Assuming API returns a success message
    } catch (ex) {
        if (ex instanceof AxiosError) {
            console.error("Update Password Error:", ex.response?.data);
            // Attempt to extract a meaningful error message
            const errorMessage =
                ex.response?.data?.message ||
                ex.response?.data ||
                "Failed to update password.";
            throw new Error(errorMessage);
        }
        throw new Error("An unexpected error occurred.");
    }
}