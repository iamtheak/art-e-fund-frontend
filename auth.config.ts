import axios, {AxiosError} from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {API_ROUTES, BASE_URL} from "./config/routes";
import {TLoginResponse} from "@/global/types";
import {CredentialsSignin, User} from "next-auth";

if (process.env.NODE_ENV === "development") {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

class CustomError extends CredentialsSignin {
    code = "custom_error"
}

export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Sign In",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                try {
                    if (!credentials || !credentials.email || !credentials.password) {
                        return null;
                    }

                    const response = await axios.post<TLoginResponse>(
                        `${BASE_URL}${API_ROUTES.AUTH.LOGIN}`,
                        credentials,
                        {
                            withCredentials: true,
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const user: User = {
                        ...response.data.user,
                        id: response.data.user.userId,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                        accessTokenExpires: response.data.accessTokenExpires,
                        refreshTokenExpires: response.data.refreshTokenExpires,
                    };

                    return user;

                } catch (error) {
                    if (error instanceof AxiosError) {
                        if (error.response?.status === 401) {
                            throw new CredentialsSignin()
                        }
                    }

                    throw new CustomError({
                        message: "An unexpected error occurred",
                    })

                }
            },
        }),
        GoogleProvider,
    ],
};
