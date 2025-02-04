"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";
import {profileFormSchema} from "@/app/(pages)/(settings)/profile/validator";
import {UpdateProfile} from "@/app/(pages)/(settings)/profile/action";
import {useSession} from "next-auth/react";
import ImageInput from "@/components/image-input/image-input";


export function ProfileForm({defaultValues}: { defaultValues: TProfileFormValues }) {
    const form = useForm<TProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
        defaultValues: defaultValues,
    })

    const {toast} = useToast();
    const {update, data: session} = useSession();
    const handleCropComplete =  (croppedImageData: string) => {
       console.log(croppedImageData)
    }

    async function onSubmit(data: TProfileFormValues) {

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        })

        const user = await UpdateProfile(data);

        if (user === null) {

            toast({title: "Error", description: "An error occurred while updating your profile."});
            return;
        }
        if (session === null) {
            return
        }
        await update({
            ...session,
            user: {
                ...session.user,
                ...user,
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <ImageInput onCropComplete={handleCropComplete} />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Firstname</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Lastname</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>

                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="userName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. It can be your real name or a
                                pseudonym. You can only change this once every 30 days.
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="xyz@abc.com" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <Button type="submit">Update profile</Button>


            </form>


        </Form>
    )
}