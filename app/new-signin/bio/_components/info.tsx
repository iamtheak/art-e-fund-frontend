"use client"
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import newCreatorSchema from "@/app/new-signin/bio/_components/validator";
import {TNewCreator} from "@/app/new-signin/bio/_components/types";
import {useSession} from "next-auth/react";
import {useMutation} from "@tanstack/react-query";
import {useNewCreatorStore} from "@/providers/new-creator/provider";
import {createNewCreator} from "@/app/new-signin/bio/_components/action";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {Label} from "@/components/ui/label";
import {BaseInput} from "@/components/base-input/base-input";
import {useEffect} from "react";

export default function InfoTab() {

    const {data: session, update} = useSession()
    const {contentTypeId, setBio, setDescription} = useNewCreatorStore();

    const router = useRouter()
    const userName = session?.user.userName ?? ""

    const {toast} = useToast();
    const form = useForm<TNewCreator>({
        resolver: zodResolver(newCreatorSchema),
        defaultValues: {
            bio: "",
            description: "",
            userName: userName,
        }
    },);


    useEffect(() => {
        form.setValue("userName", userName)
    }, [form, userName])
    const mutation = useMutation({
        mutationFn: async (data: TNewCreator) => {
            return await createNewCreator(data, contentTypeId)
        },
        onSuccess: async (creator) => {
            toast({title: "You are a creator !", description: "Creator created successfully"})

            await update({
                user: {
                    ...session,
                    role: "creator",
                    creatorId: creator.creatorId,
                    userName: creator.userName,
                }
            })
            router.push("/home")
        },
        onError: (error) => {
            toast({title: "Error", description: error.message})
        }

    })

    const onSubmit = async (data: TNewCreator) => {
        setDescription(data.description)
        setBio(data.bio)
        mutation.mutate(data)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"w-full flex flex-col gap-5"}>
                <Card className={"w-full"}>
                    <CardHeader className={""}>
                        <p className={"text-5xl"}>
                            Tell the world about yourself ❤️
                        </p>

                    </CardHeader>
                    <CardContent className={"w-full flex flex-col gap-2"}>
                        <div>
                            <BaseInput {...form.register("bio")} label={"Bio"}
                                       error={form.formState.errors.bio?.message}
                                       placeholder={"your friendly creator"} type={"text"} maxLength={100}/>
                        </div>
                        <div>

                            <BaseInput {...form.register("userName")} label={"UserName"}
                                       error={form.formState.errors.userName?.message}
                                       placeholder={"satan_121-2"} type={"text"} maxLength={13}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea {...form.register("description")} placeholder={"I am Monkey D Luffy"}
                                      maxLength={300} className={"w-full h-28 resize-none"}/>
                            {
                                form.formState.errors.description && <span
                                    className={"text-red-600 mt-2 text-xs"}>{form.formState.errors.description?.message}</span>
                            }
                        </div>
                    </CardContent>
                    <CardFooter className={"flex justify-end"}>
                        <div className={"flex gap-5"}>
                            <Button type={"button"} asChild>
                                <Link href={"/new-signin/content"}>Back</Link>
                            </Button>

                            <Button type={"submit"}>
                                Submit
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}