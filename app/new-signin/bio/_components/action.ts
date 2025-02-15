"use server"
import axiosInstance from "@/config/axios";
import {TNewCreator} from "@/app/new-signin/bio/_components/types";
import {API_ROUTES} from "@/config/routes";
import {auth} from "@/auth";
import {AxiosError} from "axios";
import {TCreator} from "@/global/types";

export const createNewCreator = async (data: TNewCreator, contentTypeId: number): Promise<TCreator> => {
    try {

        const session = await auth()

        if (!session) {
            throw new Error("Unauthorized")
        }

        const {user} = session
        user.userName = data.userName;

        const response = await axiosInstance.put(API_ROUTES.USER + "/" + user.userId, user);

        await axiosInstance.patch(API_ROUTES.USER + "/role/" + user.userId, {
            role: "creator"
        })

        const creatorCreate = await axiosInstance.post<TCreator>(API_ROUTES.CREATOR.BASE, {
            ...data,
            userId: response.data.userId,
            contentTypeId
        })

        return creatorCreate.data;

    } catch (error) {
        if (error instanceof AxiosError) {

            if (error.status === 500) {

                throw new Error("Something went wrong with the server")
            }

            throw new Error(error.response?.data)
        }

        throw error;
    }
}