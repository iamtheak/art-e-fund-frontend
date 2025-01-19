import NextAuth from "next-auth";
import {authConfig} from "./auth.config";
import axios from "axios";
import {API_ROUTES, BASE_URL} from "./config/routes";
import {TLoginResponse, TRefreshResponse, TToken, TUser} from "@/global/types";
import {AdapterUser} from "@auth/core/adapters";


function parseExpiry(dateString: string): number {
    return Date.parse(dateString);
}

async function refreshAccessToken(token: TToken) {
    try {
        // Check if refresh token has expired
        if (Date.now() >= parseExpiry(token.refreshTokenExpires)) {
            throw new Error("RefreshTokenExpired");
        }

        const response = await axios.post<TRefreshResponse>(
            `${BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
            token.refreshToken,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            ...token,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken ?? token.refreshToken,
            accessTokenExpires: parseExpiry(response.data.accessTokenExpires),
            refreshTokenExpires: parseExpiry(response.data.refreshTokenExpires),
        };
    } catch (error) {
        return {
            ...token,
            error: error instanceof Error && error.message === "RefreshTokenExpired"
                ? "RefreshTokenExpired"
                : "RefreshAccessTokenError",
        };
    }
}

export const {auth, handlers, signIn, signOut} = NextAuth({
    ...authConfig,
    callbacks: {
        async jwt({token, user, account}) {
            console.log("token jwt", token)
            if (account?.provider === "google") {
                try {
                    const resp = await axios.post<TLoginResponse>(
                        BASE_URL + API_ROUTES.AUTH.GOOGLE_VERIFY,
                        account.id_token,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    return {...resp.data, ...resp.data.user};
                } catch {

                    return Promise.reject("Invalid google token");
                }
            }

            if (token.accessTokenExpires && Date.now() >= parseExpiry(token.accessTokenExpires as string)) {
                const refreshedToken = await refreshAccessToken({
                    accessTokenExpires: token.accessTokenExpires,
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                    refreshTokenExpires: token.refreshTokenExpires,
                } as TToken);
                return {...refreshedToken, ...user};
            }
            return {...token, ...user};
        },

        async session({session, token}) {
            session.user = {...token, id: token.userId as string, emailVerified: null} as AdapterUser & TUser;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60,
    },
});
