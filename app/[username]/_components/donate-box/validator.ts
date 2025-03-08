// app/[username]/_components/donate-box/schema.ts
import { z } from "zod";

export const donationSchema = z.object({
  donationAmount: z.number().min(1, "Amount must be at least $1").max(10000, "Amount cannot exceed $10,000"),
  donationMessage: z.string().max(500, "Message cannot exceed 500 characters").optional(),
  creatorId: z.number().int().positive("Creator ID is required"),
  isAnonymous: z.boolean().default(false)
});

export type TDonationSchema = z.infer<typeof donationSchema>;