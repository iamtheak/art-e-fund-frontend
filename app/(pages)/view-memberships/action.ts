"use server"


import axiosInstance from "@/config/axios";
import {TCreator, TEnrolledMembership, TKhaltiResponse} from "@/global/types";
import {API_ROUTES} from "@/config/routes";
import {AxiosError} from "axios";
import {getUserFromSession} from "@/global/helper";

export const getCreatorById = async (creatorId: number) => {
    try {
        const response = await axiosInstance.get<TCreator>(API_ROUTES.CREATOR.BASE + "/" + creatorId)
        return response.data

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status === 404) {
                return {} as TCreator
            }
        }
        return {} as TCreator
    }
}

export const getEMByUserId = async (userId: number | string) => {
    try {
        const response = await axiosInstance.get<TEnrolledMembership[]>(API_ROUTES.MEMBERSHIP.ENROLLED.USER + "/" + userId)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status === 404) {
                return []
            }
        }
        return null
    }
}

export const changeMembership = async (membershipId: number) => {
    try {
        const user = await getUserFromSession()

        if (user === null) {
            throw new Error("User should be logged in to change membership")
        }
        const response = await axiosInstance.post<TKhaltiResponse>(API_ROUTES.MEMBERSHIP.KHALTI.BASE, {
            userId: user.userId,
            type: 1,
            membershipId: membershipId
        })

        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
        throw error
    }
}

export const endEnrolledMembership = async (enrolledMembershipId: number) => {
    const user = await getUserFromSession()

    if (user === null) {
        throw new Error("User should be logged in to end membership")
    }
    try {
        const response = await axiosInstance.delete(API_ROUTES.MEMBERSHIP.ENROLLED.END + `?enrolledMembershipId=${enrolledMembershipId}`,)

        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data.message)
        }
        throw error
    }
}