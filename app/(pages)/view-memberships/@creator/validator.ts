import z from "zod";


export const membershipSchema = z.object({
    membershipTier: z.number().int().min(1, "Membership tier is required").max(4, "Membership tier must be 4 or less"),
    membershipName: z.string().min(1, "Membership name is required").max(50, "Membership name must be 50 characters or less"),
    membershipBenefits: z.string().min(1, "Membership description is required").max(500, "Membership description must be 500 characters or less"),
    membershipAmount: z.coerce.number().int().min(1, "Membership price is required").max(20000, "Membership price must be 100 or less"),
})
