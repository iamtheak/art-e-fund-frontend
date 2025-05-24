import {z} from "zod";

export const registerSchema = z
    .object({
        firstName: z.string().trim().min(1, "First name is required"),
        lastName: z.string().trim().min(1, "Last name is required"),
        userName: z.string()
            .regex(/^[a-z0-9-_]+$/, "User name can only contain lowercase characters, numbers, hyphens, and underscores")
            .min(3, "User name must be at least 3 characters long")
            .max(30, "User name must be 30 characters or less")
        ,
        email:
            z.string().email("Invalid email address"),
        password:
            z
                .string()
                .trim()
                .min(8, "Password must be at least 8 characters long")
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                ),
        confirmPassword:
            z
                .string()
                .min(8, "Confirm password must be at least 8 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
