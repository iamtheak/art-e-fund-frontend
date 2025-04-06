"use server"

import axiosInstance from "@/config/axios";
import {TEnrolledMembership, TMembership} from "@/global/types";
import {API_ROUTES} from "@/config/routes";
import {AxiosError} from "axios";

export const getCreatorMemberships = async (userName: string) => {
    try {
        const response = await axiosInstance.get <TMembership[]>(API_ROUTES.MEMBERSHIP.CREATOR.userName + "/" + userName)
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

export const updateMembership = async (membership: TMembership) => {
    try {
        const response = await axiosInstance.put<TMembership>(API_ROUTES.MEMBERSHIP.BASE + "/" + membership.membershipId, membership)
        return "Membership updated successfully"
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data)
        }
    }
    throw new Error("An error occurred while updating membership")
}

export const createNewMembership = async (membership: TMembership) => {
    try {
        const response = await axiosInstance.post<TMembership>(API_ROUTES.MEMBERSHIP.BASE, membership)

        return "Membership created successfully"
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data)
        }
    }

    throw new Error("An error occurred while creating membership")
}


export const deleteMembership = async (membershipId: number) => {
    try {
        const response = await axiosInstance.delete(API_ROUTES.MEMBERSHIP.BASE + "/" + membershipId)
        return "Membership deleted successfully"
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data)
        }
    }
    throw new Error("An error occurred while deleting membership")
}

export const getCreatorMembers = async (creatorId: number | string) => {
    try {
        const response = await axiosInstance.get<TEnrolledMembership[]>(`${API_ROUTES.MEMBERSHIP.ENROLLED.CREATOR}/${creatorId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data)
        }
    }
}