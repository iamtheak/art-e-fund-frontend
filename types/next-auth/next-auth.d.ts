import {TUser} from "@/global/types";

declare module "next-auth" {
    interface Session {
        user: TUser;
    }

    interface User {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        userName: string;
        role: "admin" | "user" | "creator";
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: string;
        refreshTokenExpires: string;
        profilePicture: string;
        error?: string | null;
        creatorId?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "admin" | "user" | "creator";
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: string;
        refreshTokenExpires: string;
        profilePicture: string;
        error?: string | null;
    }
}
