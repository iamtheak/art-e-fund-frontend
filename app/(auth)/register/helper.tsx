import {API_ROUTES, BASE_URL} from "@/config/routes";
import axios, {AxiosError} from "axios";
import {TRegisterFormProps} from "./types";

export const registerRequest = async (data: TRegisterFormProps) => {
    try {
        const localAxios = axios.create({
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await localAxios.post(BASE_URL + API_ROUTES.AUTH.REGISTER, data);

        return response.data;

    } catch (e) {
        const error = e as AxiosError<{ errors: string[] } | string>;

        if (error.response?.data && typeof error.response.data === "object") {
            const errorMessage = error.response.data.errors[0];
            throw new Error(errorMessage);
        }
        if (error.response?.data && typeof error.response.data === "string") {
            throw new Error(error.response.data);
        }

        throw new Error("An unexpected error occurred");
    }
};