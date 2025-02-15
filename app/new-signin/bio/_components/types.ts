import newCreatorSchema from "@/app/new-signin/bio/_components/validator";
import z from "zod";

export type TNewCreator = z.infer<typeof newCreatorSchema>;