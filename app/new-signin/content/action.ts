"use server"
import axiosInstance from "@/config/axios";
import {TContentType} from "@/app/new-signin/content/types";
import {AxiosError} from "axios";


export const getContentTypes = async (): Promise<TContentType[]> => {

    try {
        const response = await axiosInstance.get<TContentType[]>('/creators/content-type');
        return response.data;
    } catch (error) {
        console.log(error)
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
    }

    return [];
}