"use client";
import FloatingInput from "@/components/floating-input/floating-input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {TRegisterFormProps} from "./types";
import {useForm} from "react-hook-form";
import {registerSchema} from "./validator";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerRequest} from "./helper";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import Loader from "@/components/loader";
import {LoginGoogleButton} from "@/app/(auth)/_components/login-google-button";

export default function RegisterPage() {
    const router = useRouter();
    const {toast} = useToast();

    const {
        register,
        formState: {errors, isSubmitting},
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
                    description: "A verification email has been sent to your email address.",
                });

                localStorage.setItem("localUser", JSON.stringify({
                    email: data.email,
                    newSignIn: true
                }));

                router.push("/login");
            }
        } catch (e) {
            if (e instanceof Error) {
                toast({
                    title: "Error",
                    description: e.message,
                });
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred.",
                });
            }
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
                            disabled={isSubmitting}
                        >
                            {
                                isSubmitting && <Loader/>
                            }
                            {
                                isSubmitting
                                    ? "Creating Account..."
                                    : "Create Account"
                            }
                        </Button>
                    </form>
                    <div className="relative">
                        <Separator/>
                        <span
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              Or
            </span>
                    </div>
                    <LoginGoogleButton text={"Sign up with Google"}/>
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
