// app/[username]/_components/toast-handler.tsx
'use client';

import {useEffect} from 'react';
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export default function ToastHandler({message}: { message?: string }) {
    const {toast} = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!message) return;

        if (message === 'donation-success') {
            toast({
                title: 'Success!',
                description: 'Donation successful',
                variant: 'default',
            });

        } else if (message === 'error') {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive',
            });
        }
    }, [message, toast]);

    return null;
}