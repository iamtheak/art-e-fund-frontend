// app/(pages)/home/action.ts
"use server"

import {getUserFromSession} from "@/global/helper";
import axiosInstance from "@/config/axios"; // Assuming axios instance is configured here
import {API_ROUTES} from "@/config/routes";
import {Donator} from "@/app/(pages)/home/_components/top-donators"; // Adjust import path if needed
import {NewMember} from "@/app/(pages)/home/_components/new-members"; // Adjust import path if needed
import axios from "axios";
import {TDonationChartData} from "@/app/(pages)/home/_components/donation-chart"; // Import axios for error checking

// Define expected structure for donation sources
type DonationSourceData = {
    userTotal: number;
    anonymousTotal: number;
};

export type TotalStats = {
    totalMembers: number;
    totalDonations: number;
    totalProfileViews: number;
};

// Helper function to check user and creatorId
async function checkUserAndGetCreatorId() {
    const user = await getUserFromSession();
    if (!user) {
        console.error("User session not found.");
        return null; // Or throw new Error("User session not found.");
    }
    if (!user.creatorId) {
        console.error("User is not associated with a creator profile.");
        return null; // Or throw new Error("User is not a creator");
    }
    return user.creatorId;
}

// Action to get total members
export async function getTotalMembers(): Promise<number> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return 0;

    try {
        const response = await axiosInstance.get<number>(API_ROUTES.HOME.TOTAL_MEMBERS, {
            params: {creatorId}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching total members:", axios.isAxiosError(error) ? error.message : error);
        return 0;
    }
}

// Action to get total donations amount
export async function getTotalDonations(): Promise<number> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return 0;

    try {
        const response = await axiosInstance.get<number>(API_ROUTES.HOME.TOTAL_DONATIONS, {
            params: {creatorId}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching total donations:", axios.isAxiosError(error) ? error.message : error);
        return 0;
    }
}

// Action to get total profile views
export async function getProfileViews(): Promise<number> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return 0;

    try {
        const response = await axiosInstance.get<number>(API_ROUTES.HOME.TOTAL_PROFILE_VIEWS, {
            params: {creatorId}
        });
        return response.data;
    } catch (error) {

        console.error("Error fetching profile views:", axios.isAxiosError(error) ? error.message : error);
        return 0;
    }
}

// Action to get daily donations data for the chart
export async function getDailyDonations(startDate?: string, endDate?: string): Promise<TDonationChartData[]> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return [];

    try {
        const params: { creatorId: string | number; startDate?: string; endDate?: string } = {creatorId};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await axiosInstance.get<TDonationChartData[]>(API_ROUTES.HOME.DAILY_DONATION, {params});
        return response.data;
    } catch (error) {
        console.error("Error fetching daily donations:", axios.isAxiosError(error) ? error.message : error);
        return [];
    }
}

// Action to get the list of top donators
export async function getTopDonators(): Promise<Donator[]> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return [];

    try {
        const response = await axiosInstance.get<Donator[]>(API_ROUTES.HOME.TOP_DONATORS, {
            params: {creatorId}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching top donators:", axios.isAxiosError(error) ? error.message : error);
        return [];
    }
}

// Action to get donation source totals (user vs anonymous)
export async function getDonationSources(): Promise<DonationSourceData> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return {userTotal: 0, anonymousTotal: 0};

    try {
        const response = await axiosInstance.get<DonationSourceData>(API_ROUTES.HOME.DONATION_SOURCES, {
            params: {creatorId}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching donation sources:", axios.isAxiosError(error) ? error.message : error);
        return {userTotal: 0, anonymousTotal: 0};
    }
}

// Action to get the list of new members
export async function getNewMembersAction(): Promise<NewMember[]> {
    const creatorId = await checkUserAndGetCreatorId();
    if (!creatorId) return [];

    try {
        const response = await axiosInstance.get<NewMember[]>(API_ROUTES.HOME.NEW_MEMBERS, {
            params: {creatorId}
        });
        // Convert joinDate string to Date object if necessary
        return response.data.map(member => ({
            ...member,
            joinDate: new Date(member.joinDate) // Assuming API returns date as string
        }));
    } catch (error) {
        console.error("Error fetching new members:", axios.isAxiosError(error) ? error.message : error);
        return [];
    }
}

// Combined action to get all header stats
export async function getHeaderStats(): Promise<TotalStats> {
    // No need to check user here, individual actions will do it.
    // Fetch all stats in parallel
    try {
        const [totalMembers, totalDonations, totalProfileViews] = await Promise.all([
            getTotalMembers(),
            getTotalDonations(),
            getProfileViews()
        ]);

        return {
            totalMembers,
            totalDonations,
            totalProfileViews,
        };
    } catch (error) {
        // This catch might be redundant if individual actions handle errors and return defaults
        console.error("Error fetching header stats:", error);
        return {totalMembers: 0, totalDonations: 0, totalProfileViews: 0};
    }
}