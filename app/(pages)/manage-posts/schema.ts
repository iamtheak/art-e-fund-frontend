// app/(pages)/manage-posts/schema.ts
import * as z from "zod";

export const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
    isMembersOnly: z.boolean(),
    membershipTier: z.number().min(0),
    postSlug: z.string().min(0).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;