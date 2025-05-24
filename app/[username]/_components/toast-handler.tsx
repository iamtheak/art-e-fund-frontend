// app/[username]/_components/toast-handler.tsx
'use client';

import {useEffect} from 'react';
import {useToast} from "@/hooks/use-toast";

export default function ToastHandler({message}: { message?: string }) {
    const {toast} = useToast();

    useEffect(() => {
        if (!message) return;

        if (message === 'donation-success') {
            setTimeout(() => {
                toast({
                    title: 'Success!',
                    description: 'Donation successful',
                    variant: 'default',
                });
            }, 1000)

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