import {z} from "zod";
import {loginSchema} from "./validator";


export type TLoginFormProps = z.infer<typeof loginSchema>
