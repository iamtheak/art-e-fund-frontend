// app/(pages)/view-donations/action.ts
"use server"

import axiosInstance from "@/config/axios";
import {TDonation} from "@/app/(pages)/view-donations/donation-table";

export async function getDonationsForCreator(creatorId: number) {
  try {
    const response = await axiosInstance.get<TDonation[]>('/donation/creator/' + creatorId);
    return response.data.map((donation: TDonation) => ({
      ...donation,
      donor: donation.userId ? `User #${donation.userId}` : "Anonymous"
    }));
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    return [];
  }
}