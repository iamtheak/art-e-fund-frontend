"use server"
import axiosInstance from "@/config/axios";

export async function GetTotalUsers() {
    try {
        const response = await axiosInstance.get<number>("/user/total")
        return response.data;
    } catch (error) {
        console.error("Error fetching total users:", error);
        return 0;
    }
}

export async function GetTotalDonations() {
    try {
        const response = await axiosInstance.get<number>("/donation/total")
        return response.data;
    } catch (error) {
        console.error("Error fetching total donations:", error);
        return 0;
    }
}

export async function GetTotalCreators() {
    try {
        const response = await axiosInstance.get<number>("/creators/total")
        return response.data;
    } catch (error) {
        console.error("Error fetching total creators:", error);
        return 0;
    }
}

export async function GetRecentUsers() {
    try {
        const response = await axiosInstance.get("/user/recent")
        return response.data;
    } catch (error) {
        console.error("Error fetching recent users:", error);
        return [];
    }
}


export async function GetTopEarners() {
    try {
        const response = await axiosInstance.get("/home/gettopearners/admin/top-earners")
        return response.data;
    } catch (error) {
        console.error("Error fetching top earners:", error);
        return [];
    }
}

export async function GetDailyDonationsAdmin() {
    try {
        const response = await axiosInstance.get("/home/getdailydonationsadmin/admin/daily-donations")
        return response.data;
    } catch (error) {
        console.error("Error fetching daily donations:", error);
        return [];
    }
}