// app/(auth)/update-password/types.ts
import {z} from "zod";

export const updatePasswordSchema = z
    .object({
        newPassword: z.string()
            .trim()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
        confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Set the error path to confirmPassword field
    });

export type TUpdatePassword = z.infer<typeof updatePasswordSchema>;