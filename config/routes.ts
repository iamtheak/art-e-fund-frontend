export const BASE_URL = "https://localhost:44342/api";

export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        GOOGLE_VERIFY: "/auth/google-login"
    },
    POST: {
        BASE: "/post",
        SLUG: "/post/slug",
        CREATOR: "/post/creator",
        USER: "/post/user",
        LIKE: {
            BASE: "/post/like",
            POST: "/post/likes/post",
        },
        COMMENT: {
            BASE: "/post/comment",
            POST: "/post/comments",
        }
    },
    CREATOR: {
        BASE: "/creators",
        USER_ID: "/creators/user/",
        USERNAME: "/creators/username/",
        CONTENT_TYPE: "/creators/content-type",
    },
    MEMBERSHIP: {
        BASE: "/membership",
        CREATOR: {
            BASE: "/membership/creator",
            userName: "/membership/creator/username",
        },
        ENROLL: "/membership/enroll",
        CHANGE: "/membership/change",
        END: "/membership/end",
        ENROLLED: {
            USER: "/membership/enrolled/user",
            CREATOR: "/membership/enrolled/creator",
        },
    },
    DONATION: {
        BASE: "/donation",
        USER: "/donation/user",
        CREATOR: "/donation/creator",
        GOAL: {
            BASE: "/donation/goal",
            CREATOR: "/donation/goal/creator",
            ACTIVE: "/donation/goal/active",
            INACTIVE: "/donation/goal/inactive",
        }
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
    "/manage-posts",
    "/analytics",
]