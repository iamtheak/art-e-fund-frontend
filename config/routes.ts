export const BASE_URL = "https://localhost:44342/api";

export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        GOOGLE_VERIFY: "/auth/google-login",
        FORGOT_PASSWORD: "/auth/forgotpassword",
        RESET_PASSWORD: "/auth/updateforgotpassword",
        VERIFY_ACCOUNT: "/auth/verifyaccount",
        RESEND_VERIFICATION: "/auth/resendverificationlink",
    },
    HOME: {
        TOTAL_MEMBERS: "/home/gettotalmembers",
        TOTAL_DONATIONS: "/home/gettotaldonations",
        TOTAL_PROFILE_VIEWS: "/home/getprofileviews",
        DAILY_DONATION: "/home/getdailydonations",
        TOP_DONATORS: "/home/gettopdonators",
        DONATION_SOURCES: "/home/getdonationsources",
        NEW_MEMBERS: "/home/getnewmembers",
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
        },
        TOP: "/post/top",
    },
    CREATOR: {
        BASE: "/creators",
        USER_ID: "/creators/user/",
        USERNAME: "/creators/username/",
        CONTENT_TYPE: "/creators/content-type",
        PROFILE_VISIT: "/creators/profile-visit",
        FOLLOW: "/creators/follow", // Base path for POST: /follow/{creatorId}/{userId}
        UNFOLLOW: "/creators/unfollow", // Base path for DELETE: /unfollow/{creatorId}/{userId}
        IS_FOLLOWING: "/creators/is-following", // Base path for GET: /is-following/{creatorId}/{userId}
        FOLLOWERS: "/creators/followers", // Base path for GET: /followers/{creatorId}
        FOLLOWER_COUNT: "/creators/follower-count", // Base path for GET: /follower-count/{creatorId}
        FOLLOWING: "/creators/following", // Base
        API_KEY: "/creators/api-key",
    },
    MEMBERSHIP: {
        BASE: "/membership",
        CREATOR: {
            BASE: "/membership/creator",
            userName: "/membership/creator/username",
            GROWTH: "/membership/creator/growth",
        },
        ENROLL: "/membership/enroll",
        CHANGE: "/membership/change",
        ENROLLED: {
            END: "/membership/enrolled/end",
            USER: "/membership/enrolled/user",
            CREATOR: "/membership/enrolled/creator",
        },
        KHALTI: {
            BASE: "/membership/khalti/initiate",
            VERIFY: "/membership/khalti/verify",
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
        },
        KHALTI: {
            BASE: "/donation/khalti/initiate",
            VERIFY: "/donation/khalti/verify",
        }
    },
    USER: "/user",
};


export const AUTHENTICATED_ROUTES = [
    "/explore",
    "/view-donations",
    "/view-memberships",
    "/profile",
]

export const CREATOR_ROUTES = [
    "/posts",
    "/home",
]

export const ADMIN_ROUTES = [
    "/dashboard",
]