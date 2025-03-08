import {z} from "zod";
import {registerSchema} from "./validator";

export type TRegisterFormProps = z.infer<typeof registerSchema>;


export type TLocalUser = {
    email: string,
    newSignIn: boolean
}