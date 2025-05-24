// app/(auth)/forgot-password/forgot-password-form.tsx
"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {forgotPasswordSchema, TForgotPassword} from "./types";
import {forgotPassword} from "./action";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

export function ForgotPasswordForm() {
    const {toast} = useToast();
    const form = useForm<TForgotPassword>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            toast({
                title: "Success",
                description: data,
            });
            form.reset();
            router.push("/link-sent");

        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset link.",
                variant: "destructive",
            });
        },
    })

    const onSubmit = async (data: TForgotPassword) => {
        await mutation.mutateAsync(data.email);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm space-y-4 mb-5"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="your@email.com" {...field} type="email"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>
        </Form>
    );
}