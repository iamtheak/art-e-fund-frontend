"use server"
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";


export async function verifyMembership(khaltiPaymentId: string, membershipId: number, userId: number,type: number) {
    try {
        const response = await axiosInstance.post(API_ROUTES.MEMBERSHIP.KHALTI.VERIFY, {
            khaltiPaymentId,
            membershipId,
            userId,
            type
        })
        return response.data;
    } catch {
        return null
    }
}
