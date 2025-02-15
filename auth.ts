import NextAuth from "next-auth";
import {authConfig} from "./auth.config";
import axios from "axios";
import {API_ROUTES, BASE_URL} from "./config/routes";
import {TLoginResponse, TRefreshResponse, TToken, TUser} from "@/global/types";
import {AdapterUser} from "@auth/core/adapters";

function parseExpiry(dateString: string): number {

    return Date.parse(dateString);
}

let isRefreshing = false;

async function refreshAccessToken(token: TToken) {

    if (isRefreshing) {
        return {...token}
    }
    isRefreshing = true;
    try {
        if (Date.now() >= parseExpiry(token.refreshTokenExpires)) {
            return {...token, error: "RefreshTokenExpired"};
        }

        const response = await axios.post<TRefreshResponse>(
            `https://localhost:44342/api/auth/refresh`,
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
    } catch (e) {
        console.log(e)

        return {...token, error: "RefreshAccessTokenError"};
    } finally {
        isRefreshing = false;
    }
}

export const {auth, handlers, signIn, signOut} = NextAuth({
    ...authConfig,
    callbacks: {
        async jwt({token, user, session, account, trigger}) {
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
                    return Promise.reject("InvalidGoogleToken");
                }
            }


            if (token.accessTokenExpires && Date.now() >= parseExpiry(token.accessTokenExpires as string)) {

                const refreshedToken = await refreshAccessToken(token as TToken);

                if (refreshedToken.error === "RefreshTokenExpired") {
                    return {error: "RefreshTokenExpired"};
                }

                return {...refreshedToken, ...user};
            }

            if (trigger === "update" && session) {

                return {...token, ...user, ...session.user};
            }
            if (trigger === "update" && session) {
                return {...token, ...user, ...session.user};
            }

            return {...token, ...user};
        },

        async session({session, token}) {
            session.user = {...token, id: token.userId as string, emailVerified: null} as AdapterUser & TUser;
            if (token.error === "RefreshTokenExpired") {
                session.user.error = "RefreshTokenExpired";
            } else {
                session.user.error = null;
            }

            return session;
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60, // 10 days
    },
});
