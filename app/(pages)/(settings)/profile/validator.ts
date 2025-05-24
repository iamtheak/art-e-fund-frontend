import {z} from "zod";

export const profileFormSchema = z.object({
    firstName: z.string().min(2).max(30).regex(/^[a-zA-Z]+$/, "First name can only contain letters"),
    lastName: z.string().min(2).max(30).regex(/^[a-zA-Z]+$/, "Last name can only contain letters"),
    userName: z.string()
        .regex(/^[a-z0-9-_]+$/, "User name can only contain lowercase characters, numbers, hyphens, and underscores")
        .min(3, "User name must be at least 3 characters long")
        .max(30, "User name must be 30 characters or less")
    ,
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    // profilePicture: z.string().url(),
})
