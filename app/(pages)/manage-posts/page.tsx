"use client";
// app/(pages)/manage-posts/page.tsx

import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Loader2} from "lucide-react";
import {createPost, CreatePostInput, deletePost, getPosts, Post, updatePost} from "./action";
import {PostFormValues} from "./schema";
import {useSession} from "next-auth/react";
import {PostList} from "@/app/(pages)/manage-posts/post-list";
import {PostForm} from "@/app/(pages)/manage-posts/post-form";
import {useToast} from "@/hooks/use-toast";
import {useSearchParams} from "next/navigation";

export default function ManagePosts() {
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const searchParams = useSearchParams()
    const isCreate = searchParams.get("create") === "true";

    const [activeTab, setActiveTab] = useState("posts");

    useEffect(() => {
        if (isCreate) {
            setActiveTab("create");
        } else {
            setActiveTab("posts");
        }
    }, [isCreate, setActiveTab, searchParams.get("create") === "true"])

    const session = useSession();
    const creatorId = session.data?.user.creatorId ?? 0;

    // Fetch posts query
    const {data: posts = [], isLoading: isLoadingPosts} = useQuery({
        queryKey: ["posts", creatorId],
        queryFn: () => getPosts(creatorId),
    });

    // Create post mutation
    const createPostMutation = useMutation({
        mutationFn: (data: CreatePostInput) => createPost(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["posts", creatorId]});
            setActiveTab("posts");
            toast({title: "Success", description: "Post created successfully"});
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create post",
                variant: "destructive"
            });
        },
    });

    // Update post mutation
    const updatePostMutation = useMutation({
        mutationFn: ({id, data}: { id: number; data: CreatePostInput }) =>
            updatePost(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["posts", creatorId]});
            setEditingPost(null);
            setActiveTab("posts");
            toast({title: "Success", description: "Post updated successfully"});
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update post",
                variant: "destructive"
            });
        },
    });

    // Delete post mutation
    const deletePostMutation = useMutation({
        mutationFn: (postId: number) => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["posts", creatorId]});
        },
    });

    // Handle form submission for creating posts
    const handleCreateSubmit = async (data: PostFormValues) => {
        createPostMutation.mutate(data);
    };

    // Handle form submission for updating posts
    const handleUpdateSubmit = async (data: PostFormValues) => {
        if (editingPost) {
            updatePostMutation.mutate({id: editingPost.postId, data});
        }
    };
    const handleUpdateCancel = () => {
        setEditingPost(null);
        setActiveTab("posts");
    }

    const handleCreateCancel = () => {
        setActiveTab("posts");

    }

    // Handle editing a post
    const handleEditPost = (post: Post) => {
        setEditingPost(post);
        setActiveTab("edit");
    };

    // Handle deleting a post
    const handleDeletePost = async (postId: number) => {
        return deletePostMutation.mutateAsync(postId);
    };

    return (
        <div className="container mx-auto py-6 relative overflow-auto ">
            <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="posts">Your Posts</TabsTrigger>
                    <TabsTrigger value="create">Create Post</TabsTrigger>
                    {editingPost && <TabsTrigger value="edit">Edit Post</TabsTrigger>}
                </TabsList>

                <TabsContent value="posts">
                    {isLoadingPosts ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin"/>
                        </div>
                    ) : (
                        <PostList
                            creatorId={creatorId}
                            posts={posts}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            isLoading={deletePostMutation.isPending}
                        />
                    )}
                </TabsContent>

                <TabsContent value="create">
                    <PostForm
                        onSubmit={handleCreateSubmit}
                        isSubmitting={createPostMutation.isPending}
                        mode="create"
                        onCancel={handleCreateCancel}
                    />
                </TabsContent>

                {editingPost && (
                    <TabsContent value="edit">
                        <PostForm
                            defaultValues={{
                                title: editingPost.title,
                                content: editingPost.content,
                                imageUrl: editingPost.imageUrl || "",
                                isMembersOnly: editingPost.isMembersOnly,
                                membershipTier: editingPost.membershipTier,
                                postSlug: editingPost.postSlug
                            }}
                            onSubmit={handleUpdateSubmit}
                            isSubmitting={updatePostMutation.isPending}
                            mode="edit"
                            onCancel={handleUpdateCancel}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}