"use client";
import FloatingInput from "@/components/floating-input/floating-input";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {TRegisterFormProps} from "./types";
import {useForm} from "react-hook-form";
import {registerSchema} from "./validator";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerRequest} from "./helper";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const {toast} = useToast();

    const {
        register,
        formState: {errors},
        handleSubmit,
        setValue,
    } = useForm<TRegisterFormProps>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: TRegisterFormProps) => {
        try {
            const response = await registerRequest(data);
            if (response != null) {
                toast({
                    title: "Registration Successful",
                    description: "You have successfully registered please login",
                });


                localStorage.setItem("localUser", JSON.stringify({
                    email: data.email,
                    newSignIn: true
                }));

                router.push("/login");
            }
        } catch (e) {
            let error = e as Error;
            toast({
                title: "Error",
                description: error.message,
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to register
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        action={"post"}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FloatingInput<TRegisterFormProps>
                                    setValue={setValue}
                                    error={errors?.firstName?.message}
                                    label="First Name"
                                    type="text"
                                    register={register}
                                    name="firstName"
                                    className="mb-1"
                                />
                            </div>
                            <div className="space-y-2">
                                <FloatingInput<TRegisterFormProps>
                                    setValue={setValue}
                                    error={errors?.lastName?.message}
                                    label="Last Name"
                                    type="text"
                                    register={register}
                                    name="lastName"
                                    className="mb-1"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <FloatingInput<TRegisterFormProps>
                                setValue={setValue}
                                error={errors?.username?.message}
                                label="Username"
                                type="text"
                                register={register}
                                name="username"
                                className="mb-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <FloatingInput<TRegisterFormProps>
                                setValue={setValue}
                                error={errors?.email?.message}
                                label="Email"
                                type="email"
                                register={register}
                                name="email"
                                className="mb-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <FloatingInput<TRegisterFormProps>
                                setValue={setValue}
                                error={errors?.password?.message}
                                label="Password"
                                type="password"
                                register={register}
                                name="password"
                                className="mb-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <FloatingInput<TRegisterFormProps>
                                setValue={setValue}
                                error={errors?.confirmPassword?.message}
                                label="Confirm Password"
                                type="password"
                                register={register}
                                name="confirmPassword"
                                className="mb-1"
                            />
                        </div>
                        <Button
                            className="w-full"
                            type="submit"
                        >
                            Register
                        </Button>
                    </form>
                    <div className="relative">
                        <Separator/>
                        <span
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or
            </span>
                    </div>
                    <Button variant="outline" className="w-full">
                        <svg
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="google"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 488 512"
                        >
                            <path
                                fill="currentColor"
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            ></path>
                        </svg>
                        Sign up with Google
                    </Button>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        {" "}
                        Log in{" "}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
