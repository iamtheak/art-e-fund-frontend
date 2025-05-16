// app/(auth)/update-password/update-password-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePasswordSchema, TUpdatePassword } from "./types";
import { updatePassword } from "./action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function UpdatePasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<TUpdatePassword>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid or missing password reset token.",
        variant: "destructive",
      });
      router.push("/login"); // Redirect to login or forgot password page
    }
  }, [token, router, toast]);

  const mutation = useMutation({
    mutationFn: (data: TUpdatePassword) =>
      updatePassword({ ...data, token: token! }), // Pass token along with form data
    onSuccess: (message) => {
      toast({
        title: "Success",
        description: message || "Password updated successfully.",
      });
      form.reset();
      router.push("/login"); // Redirect to login after successful update
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: TUpdatePassword) => {
    if (!token) return; // Should not happen due to useEffect check, but good practice
    await mutation.mutateAsync(data);
  };

  if (!token) {
    // Optional: Render a loading or invalid token state while redirecting
    return <p>Invalid token. Redirecting...</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Form>
  );
}