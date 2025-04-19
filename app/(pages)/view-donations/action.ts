// app/(pages)/view-donations/action.ts
"use server"

import axiosInstance from "@/config/axios";
import {TDonation} from "@/app/(pages)/view-donations/donation-table";
import {API_ROUTES} from "@/config/routes";
import {AxiosError} from "axios";
import {TDonationGoal} from "@/app/(pages)/view-donations/_components/validator";

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

export async function fetchAllDonationGoals(creatorId: number) {
    try {
        const response = await axiosInstance.get<TDonationGoal[]>(API_ROUTES.DONATION.GOAL.CREATOR + '/' + creatorId);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(`Failed to fetch Donations for creator: ${error.response?.data}`);
        }
        throw error;
    }
}

export async function updateDonationGoal(goal: TDonationGoal){
    try {
        const response = await axiosInstance.put<TDonationGoal>(API_ROUTES.DONATION.GOAL.BASE, goal);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.config);
            throw new Error(`Failed to update donation goal: ${error.response?.data}`);
        }
        throw error;
    }
}

export async function createDonationGoal(goal: TDonationGoal){
    try {
        const response = await axiosInstance.post<TDonationGoal>(API_ROUTES.DONATION.GOAL.BASE, goal);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(`Failed to create donation goal: ${error.response?.data}`);
        }
        throw error;
    }
}

export async function setGoalInactive(goalId: number){
    try {
        const response = await axiosInstance.patch<TDonationGoal>(API_ROUTES.DONATION.GOAL.INACTIVE + '/' + goalId);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.config)
            throw new Error(`Failed to set donation goal inactive: ${error.response?.data}`);
        }
        throw error;
    }
}