import { z } from "zod";
import { loginSchema } from "./validator";
import { TUser } from "@/global/types";


export type TLoginFormProps = z.infer<typeof loginSchema>
