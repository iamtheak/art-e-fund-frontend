"use server";

import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TCreator} from "@/global/types";

export default async function GetALLCreators() {
    try {
        const response = await axiosInstance.get<TCreator[]>(API_ROUTES.CREATOR.BASE);
        return response.data;
    } catch (error) {
        console.error("Error fetching creators:", error);
        return []
    }
}