// app/[username]/_components/donate-box/action.ts
"use server"

import axiosInstance from "@/config/axios";
import {getUserFromSession} from "@/global/helper";
import {donationSchema, TDonationSchema} from "@/app/[username]/_components/donate-box/validator";
import {API_ROUTES} from "@/config/routes";
import {TKhaltiResponse} from "@/global/types";

export async function submitDonation(data: TDonationSchema) {
    try {
        const user = await getUserFromSession();

        const validatedData = donationSchema.parse(data);

        const userId = user && !validatedData.isAnonymous ? user.userId : undefined;
        const payload = {
            donationAmount: validatedData.donationAmount,
            donationMessage: validatedData.donationMessage,
            creatorId: validatedData.creatorId,
            userId: userId,
        };

        const response = await axiosInstance.post<TKhaltiResponse>(API_ROUTES.DONATION.KHALTI.BASE, payload);

        return {
            success: true, message: "Donation sent successfully!", payment_url: response?.data?.payment_url ?? ""
        }

    } catch (error) {
        if (error instanceof Error) {
            return {success: false, message: error.message};
        }
        return {success: false, message: "Failed to process donation"};
    }
}