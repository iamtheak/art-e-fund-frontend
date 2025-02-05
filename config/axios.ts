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

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {

        const prevRequest = error.config
        console.log(prevRequest)
        const session = await auth();
        if (error.response?.status === 401 && !prevRequest._retry) {
            if (session?.user.error === "RefreshAccessTokenError") {
                await signOut({redirectTo: "/login?error=RefreshTokenExpired"});
            }
        }


        return Promise.reject(error)
    },
)
export default axiosInstance;
