// app/(pages)/view-donations/action.ts
"use server"

import axiosInstance from "@/config/axios";
import {TDonation} from "@/app/(pages)/view-donations/donation-table";
import {API_ROUTES} from "@/config/routes";

export async function getDonationsForCreator(creatorId: number) {
    try {
        const response = await axiosInstance.get<TDonation[]>(API_ROUTES.DONATION.CREATOR + '/' + creatorId);
        return response.data.map((donation: TDonation) => ({
            ...donation,
            donor: donation.userId ? `User #${donation.userId}` : "Anonymous"
        }));
    } catch (error) {
        console.error("Failed to fetch donations:", error);
        return [];
    }
}


export async function getUserDonationsByUserId(userId: number | string) {
    try {
        const response = await axiosInstance.get<TDonation[]>('/donation/user/' + userId);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch donations:", error);
        return [];
    }
}