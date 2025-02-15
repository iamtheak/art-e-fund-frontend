import { z } from "zod";

export const newCreatorSchema = z.object({
  bio: z.string().min(1, "Bio is required").max(500, "Bio must be 500 characters or less"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be 1000 characters or less"),
  userName: z.string()
    .regex(/^[a-z0-9-_]+$/, "User name can only contain lowercase characters, numbers, hyphens, and underscores")
    .min(3, "User name must be at least 3 characters long")
    .max(30, "User name must be 30 characters or less"),
});

export default newCreatorSchema;