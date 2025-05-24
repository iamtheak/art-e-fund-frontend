"use client";
import FloatingInput from "@/components/floating-input/floating-input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {useToast} from "@/hooks/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {loginRequest} from "./action";
import {loginSchema} from "./validator";
import {TLoginFormProps} from "@/app/(auth)/login/types";
import {TLocalUser} from "@/app/(auth)/register/types";
import {LoginGoogleButton} from "@/app/(auth)/_components/login-google-button";
import Loader from "@/components/loader";

export default function LoginPage() {
    const {toast} = useToast();
    const router = useRouter();
    const session = useSession();

    const {
        register,
        formState: {errors, isSubmitting},
        handleSubmit,
        setValue,
    } = useForm<TLoginFormProps>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const params = useSearchParams();

    useEffect(() => {
        if (params) {

            const val = params.get("error");

            if (val != null) {

                toast({title: "Error", description: val});
            }

        }
    }, [params, toast]);


    const onSubmit = async (data: TLoginFormProps) => {
        try {
            const result = await loginRequest(data.email, data.password);

            if (!result.success) {
                toast({
                    title: "Error",
                    description: result.error,
                });
                return;
            }

            await session.update();
            toast({
                title: "Success",
                description: "Logged in successfully",
            });


            const localUser = localStorage.getItem("localUser")

            if (localUser) {
                localStorage.removeItem("localUser")

                const newUser: TLocalUser = JSON.parse(localUser)

                if (newUser.email === data.email && newUser.newSignIn) {
                    router.push("/new-signin/new-user")
                }
            }

            router.refresh();
        } catch {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center shadow-lg ">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        action="post"
                    >
                        <div className="space-y-4">
                            <FloatingInput<TLoginFormProps>
                                setValue={setValue}
                                error={errors?.email?.message}
                                label="Email"
                                type="email"
                                register={register}
                                name="email"
                                className="mb-1"
                            />

                            <FloatingInput<TLoginFormProps>
                                error={errors?.password?.message}
                                label="Password"
                                type="password"
                                register={register}
                                name="password"
                                setValue={setValue}
                            />
                        </div>

                        <Button className="w-full relative" type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting && <Loader/>
                            }
                            Sign In
                        </Button>
                        <div className="relative">
                            <Separator/>
                            <span
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  px-2 text-sm text-gray-500">
                Or
              </span>
                        </div>
                        <LoginGoogleButton/>
                    </form>
                </CardContent>
                <CardFooter className="text-center flex justify-between items text-sm text-gray-600 gap-2">
                    <div className={"flex flex-col items-start"}>

                        <p>Don&#39;t have an account?{" "}</p>

                        <Link
                            href="/register"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                    <div className={"flex flex-col items-start"}>
                        <p>Forgot your password?{" "}</p>
                        <Link
                            href="/forgot-password"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Reset it
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
