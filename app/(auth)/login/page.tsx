"use client";
import FloatingInput from "@/components/floating-input/floating-input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {useToast} from "@/hooks/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn, useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {loginRequest} from "./action";
import {loginSchema} from "./validator";
import {TLoginFormProps} from "@/app/(auth)/login/types";
import {TLocalUser} from "@/app/(auth)/register/types";

export default function LoginPage() {
    const {toast} = useToast();
    const router = useRouter();
    const session = useSession();

    const {
        register,
        formState: {errors},
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


                if(newUser.email === data.email && newUser.newSignIn) {
                    router.push("/new-signin/new-user")
                }
            }


            router.refresh(); // This will update the server components and trigger a re-render
        } catch {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
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

                        <Button className="w-full" type="submit">
                            Sign In
                        </Button>
                        <div className="relative">
                            <Separator/>
                            <span
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                Or
              </span>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            type="button"
                            onClick={() =>
                                signIn("google", {
                                    redirect: true,
                                    callbackUrl: "/",
                                })
                            }
                        >
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
                            Login with Google
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-600">
                    Don&#39;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
