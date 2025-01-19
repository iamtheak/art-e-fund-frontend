"use client"
import {useSession} from "next-auth/react";

export default function useClientSession() {

    const session = useSession();

    if (session === null) {
        return {
            isAuthenticated: false,
            user: null
        }
    }

    return {
        isAuthenticated: session.status === "authenticated",
        user: session.data?.user
    }
}