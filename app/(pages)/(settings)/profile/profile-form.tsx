"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";
import {profileFormSchema} from "@/app/(pages)/(settings)/profile/validator";
import {addProfilePicture, updateProfile} from "@/app/(pages)/(settings)/profile/action";
import {useSession} from "next-auth/react";
import ImageInput from "@/components/image-input/image-input";
import {useState} from "react";
import {TUser} from "@/global/types";
import Loader from "@/components/loader";


export function ProfileForm({defaultValues, originalProfilePicture}: {
    defaultValues: TProfileFormValues,
    originalProfilePicture: string
}) {

    const form = useForm<TProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: "onChange",
        defaultValues: defaultValues,
    })

    const {toast} = useToast();
    const {update, data: session} = useSession();
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(originalProfilePicture)
    const [isPending, setIsPending] = useState(false);

    const handleCropComplete = (croppedImageData: string) => {
        setProfilePicture(croppedImageData);
    }

    async function onSubmit(data: TProfileFormValues) {
        setIsPending(true);

        let profilePictureUrl = null;
        if (profilePicture !== null) {

            profilePictureUrl = await addProfilePicture(profilePicture ?? "");
            setCurrentProfilePicture(profilePictureUrl ?? "")
        }

        const user = await updateProfile(data, profilePictureUrl ?? originalProfilePicture);

        if (user === null) {
            toast({title: "Error", description: "An error occurred while updating your profile."});
            setIsPending(false);
            return;
        }
        if (session === null) {
            setIsPending(false);
            return
        }
        await update({
            ...session,
            user: {
                ...session.user,
                ...user as TUser,
            }
        })

        toast({title: "Success", description: "Your profile has been updated."});
        setIsPending(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">

                {isPending && <Loader/>}
                <ImageInput image={currentProfilePicture ?? undefined} onCropComplete={handleCropComplete}/>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Firstname</FormLabel>
                            <FormControl>
                                <Input placeholder="Jhon" {...field} />
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
                                <Input placeholder="Doe" {...field} />
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
                                <Input placeholder="jhondoe123" {...field} />
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
                                <Input disabled placeholder="xyz@abc.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />


                <Button type="submit">Update profile</Button>


            </form>


        </Form>
    )
}