import {z} from "zod";
import {profileFormSchema} from "@/app/(pages)/(settings)/profile/validator";

export type TProfileFormValues = z.infer<typeof profileFormSchema>
