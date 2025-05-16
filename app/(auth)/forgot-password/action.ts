"use server"
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {AxiosError} from "axios";

export async function forgotPassword(email: string) {
    try {

        console.log(email)
        const response = await axiosInstance.post<string>(API_ROUTES.AUTH.FORGOT_PASSWORD, {
            email: email
        })
        return response.data;

    } catch (ex) {
        if (ex instanceof AxiosError) {
            console.log(ex.response?.data);
            throw new Error(ex?.response?.data);
        }

        throw ex;
    }

}