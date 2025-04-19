// app/(pages)/manage-posts/components/post-form.tsx
"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Loader2} from "lucide-react";
import UploadImage, {UploadImageRef} from "@/components/upload-image/upload-image";
import Loader from "@/components/loader";
import {PostFormValues, postSchema} from "@/app/(pages)/manage-posts/schema";
import {toast} from "@/hooks/use-toast";
import {uploadPostImage} from "@/app/(pages)/manage-posts/action";

interface PostFormProps {
    defaultValues?: PostFormValues;
    onSubmit: (data: PostFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    mode: "create" | "edit";
}

export function PostForm({defaultValues, onSubmit, isSubmitting, mode, onCancel}: PostFormProps) {
    const [image, setImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const uploadImageRef = useRef<UploadImageRef>(null);

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: defaultValues || {
            title: "",
            content: "",
            imageUrl: "",
            isMembersOnly: false,
            membershipTier: 1,
        },
    });

    const onImageUpload = (files: File[] | undefined) => {
        if (files && files.length > 0) {
            const file = files[0];
            setImage(file);
        }
    };

    const onRemoveImage = () => {
        uploadImageRef.current?.clearImage();
        setImage(null);
        form.setValue("imageUrl", "");
    };


    const handleSubmit = async (data: PostFormValues) => {
        try {
            // If we're editing a post and have a new image, upload it with the post slug
            if (image && mode === "edit" && defaultValues?.postSlug) {
                setIsUploading(true);
                const imageUrl = await uploadPostImage(image, defaultValues.postSlug);
                if (imageUrl) {
                    data.imageUrl = imageUrl;
                }
                setIsUploading(false);
            }
            // If creating a new post with image, upload first to get temp URL
            else if (image && mode === "create") {
                setIsUploading(true);
                const imageUrl = await uploadPostImage(image);
                if (imageUrl) {
                    data.imageUrl = imageUrl;
                }
                setIsUploading(false);
            }

            await onSubmit(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive"
            });
            setIsUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{mode === "create" ? "Create New Post" : "Edit Post"}</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter post title" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your post content here..."
                                            rows={8}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <div className="w-full h-52 relative">
                                {isUploading && <Loader text="Uploading image"/>}
                                <UploadImage ref={uploadImageRef} props={{onImageUpload, maxFiles: 1}}/>
                            </div>
                            {image && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Image will be uploaded when you submit the form
                                </p>
                            )}
                            {defaultValues?.imageUrl && !image && (
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">Current image:</p>
                                    <div className="mt-1 relative h-40 w-full">
                                        <img
                                            src={defaultValues.imageUrl}
                                            alt="Current post image"
                                            className="h-full w-auto object-cover rounded-md"
                                        />
                                    </div>
                                </div>
                            )}
                            {(image || defaultValues?.imageUrl) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onRemoveImage}
                                    className="mt-2"
                                >
                                    Remove Image
                                </Button>
                            )}
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="isMembersOnly"
                            render={({field}) => (
                                <FormItem
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Members Only Content</FormLabel>
                                        <FormDescription>
                                            Mark this post as exclusive to paid members
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {form.watch("isMembersOnly") && (
                            <FormField
                                control={form.control}
                                name="membershipTier"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Membership Tier</FormLabel>
                                        <Select
                                            value={field.value.toString()}
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select membership tier"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Tier 1</SelectItem>
                                                <SelectItem value="2">Tier 2</SelectItem>
                                                <SelectItem value="3">Tier 3</SelectItem>
                                                <SelectItem value="4">Tier 4</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => {
                            form.reset()
                            onCancel();
                        }}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                            {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {mode === "create" ? "Create Post" : "Update Post"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}