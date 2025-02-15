export const BASE_URL = "https://localhost:44342/api";

export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        GOOGLE_VERIFY: "/auth/google-login"
    },
    CREATOR: {
        BASE: "/creators",
        USER_ID: "/creators/user/",
        USERNAME: "/creators/username/",
        CONTENT_TYPE: "/creators/content-type",

    },
    USER: "/user",
};


export const AUTHENTICATED_ROUTES = [
    "/home",
    "/explore",
    "/view-donations",
    "/view-memberships",
    "/settings",
    "/profile",
    "/account",
]

export const CREATOR_ROUTES = [
    "/posts",
    "/analytics",
]