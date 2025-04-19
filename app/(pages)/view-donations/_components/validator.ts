import z from 'zod'


export const donationGoalSchema = z.object({
    goalId: z.number().optional(),
    creatorId: z.number(),
    goalTitle: z.string().min(1, { message: "Title is required" }),
    goalDescription: z.string().min(1, { message: "Description is required" }),
    goalAmount: z.coerce.number().min(1000,{ message: "Target amount must be at least 1000" }),
    goalProgress: z.coerce.number().nonnegative({ message: "Current amount cannot be negative" }),
    createdAt: z.date().optional(),
    isGoalReached: z.boolean(),
    isGoalActive: z.boolean(),
})

export type TDonationGoal = z.infer<typeof donationGoalSchema>