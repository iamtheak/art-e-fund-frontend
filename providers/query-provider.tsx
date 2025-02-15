"use client"

import {TProviderBaseProps} from "@/providers/types";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";

export default function QueryProvider({children}: TProviderBaseProps) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}