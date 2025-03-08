// app/[username]/_components/donate-box/action.ts
"use server"

import axiosInstance from "@/config/axios";
import {getUserFromSession} from "@/global/helper";
import {donationSchema, TDonationSchema} from "@/app/[username]/_components/donate-box/validator";

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

        await axiosInstance.post("/donation", payload);

        return {success: true, message: "Donation sent successfully!"};
    } catch (error) {
        if (error instanceof Error) {
            return {success: false, message: error.message};
        }
        return {success: false, message: "Failed to process donation"};
    }
}