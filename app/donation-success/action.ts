"use server"
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TDonation} from "@/app/(pages)/view-donations/donation-table";

export async function verifyDonation(khaltiPaymentId: string, creatorId: number, userId: number, message: string,amount: number) {
    try {
        const response = await axiosInstance.post<TDonation>(API_ROUTES.DONATION.KHALTI.VERIFY, {
            khaltiPaymentId,
            creatorId,
            userId,
            message,
            amount
        })
        return response.data;
    } catch {
        return null
    }
}