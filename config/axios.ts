import {auth, signOut} from "@/auth";
import axios from "axios";
import {BASE_URL} from "./routes";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Replace with your API base URL
});


axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await auth();
        const token = session?.user?.accessToken ?? "";

        if (session !== null && session.user?.error === "RefreshTokenExpired") {
            await signOut({redirectTo: "/login?error=RefreshTokenExpired"});
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;
