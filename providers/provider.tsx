"use client"

import {SessionProvider} from "next-auth/react";
import {TProviderBaseProps} from "@/providers/types";

export const Provider = ({children}: TProviderBaseProps) => {
    return <SessionProvider>{children}</SessionProvider>;
};
