"use server"

import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";
import {auth} from "@/auth";
import axiosInstance from "@/config/axios";
import {API_ROUTES} from "@/config/routes";
import {TUser} from "@/global/types";

export async function UpdateProfile(data: TProfileFormValues) {
    try {


        const ses = await auth();

        if (ses === null) {
            return null;
        }

        const resp = await axiosInstance.put<TUser>(`${API_ROUTES.USER}/${ses.user.userId}`, {...data, profilePicture: ""});

        if (resp) {
            return resp.data;
        }

        return null;

    } catch (ex) {
        console.log(ex)

        return null;
    }
}