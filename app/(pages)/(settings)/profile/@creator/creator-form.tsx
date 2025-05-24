"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UpdateCreatorDetails} from "@/app/[username]/action";
import {useToast} from "@/hooks/use-toast";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getCreatorById} from "@/app/(pages)/view-memberships/action";
import {getContentTypes} from "@/app/new-signin/content/action";
import Loader from "@/components/loader";

const creatorFormSchema = z.object({
    bio: z.string().min(10,"Bio must be at least 10 characters").max(160, "Bio must be 160 characters or less"),
    description: z.string().min(50, "Description should be at least 50 characters").max(500, "Description must be 500 characters or less"),
    contentType: z.coerce.number()
});

type CreatorFormValues = z.infer<typeof creatorFormSchema>;

export function CreatorForm({creatorId}: { creatorId: number }) {
    const {toast} = useToast();


    const {data: creator, refetch} = useQuery({
        queryKey: ["creator", "profile", creatorId],
        queryFn: () => getCreatorById(creatorId),
        staleTime: Infinity,
    })


    const {data: contentTypes} = useQuery({
        queryKey: ["contentTypes"],
        queryFn: () => getContentTypes(),
        staleTime: 0,
    })
    const defaultValues: CreatorFormValues = {
        bio: creator?.creatorBio || "",
        description: creator?.creatorDescription || "",
        contentType: creator?.contentType || 0
    };


    const form = useForm<CreatorFormValues>({
        resolver: zodResolver(creatorFormSchema),
        defaultValues,
    });


    const mutation = useMutation({
        mutationFn: async (data: CreatorFormValues) => {
            return UpdateCreatorDetails({
                ...creator,
                creatorBio: data.bio ?? "",
                creatorDescription: data.description ?? "",
                contentType: data.contentType ?? "",
            });
        },
        onSuccess: async () => {
            toast({
                title: "Success",
                description: "Creator profile updated successfully",
            });
            await refetch()
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    })

    async function onSubmit(data: CreatorFormValues) {
        await mutation.mutateAsync(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative">
                {
                    mutation.isPending && <Loader/>
                }
                <FormField
                    control={form.control}
                    name="bio"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Input placeholder="Short bio" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Detailed description" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contentType"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={`${field.value}`}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select content type"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        contentTypes?.map((type) => (
                                            <SelectItem key={type.contentTypeId} value={`${type.contentTypeId}`}>
                                                {type.contentTypeName}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Updating..." : "Update Creator Profile"}
                </Button>
            </form>
        </Form>
    );
}