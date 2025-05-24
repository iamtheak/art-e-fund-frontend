// app/(pages)/manage-posts/components/post-list.tsx
"use client";

import {useState} from "react";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Eye, PenLine, Trash} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {deletePost, Post} from "@/app/(pages)/manage-posts/action";
import {ConfirmationDialog} from "@/components/confirmation-dialog/confirmation-dialog";
import {useMutation, useQueryClient} from "@tanstack/react-query";

interface PostListProps {
    posts: Post[];
    onEdit: (post: Post) => void;
    onDelete: (postId: number) => Promise<void>;
    isLoading: boolean;
    creatorId: number;
}

export function PostList({posts, onEdit, onDelete, isLoading, creatorId}: PostListProps) {
    const {toast} = useToast();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [open, setOpen] = useState(false);


    const client = useQueryClient();
    const mutation = useMutation({
        mutationFn: (postId: number) => deletePost(postId),
        onSuccess: async () => {
            toast({title: "Success", description: "Post deleted successfully"});
            setOpen(false);
            await client.invalidateQueries({queryKey: ["posts", creatorId]});
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete post",
                variant: "destructive"
            });
            setDeletingId(null)
        }
    })
    const handleDelete = async () => {
        await mutation.mutateAsync(Number(deletingId));
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You haven&#39;t created any posts yet.</p>
                <Button onClick={() => router.push("/manage-posts?create=true")}>Create Your First Post</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <ConfirmationDialog action={handleDelete} description={"Are you sure you want to delete this post"}
                                open={open} setOpen={setOpen} actionVariant={"destructive"} title={"Delete Post"}/>
            {posts.map((post) => (
                <Card key={post.postId} className={post.isMembersOnly ? "border-amber-500" : ""}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>
                                    {format(new Date(post.createdAt), "PPP")}
                                    {post.isMembersOnly && (
                                        <span className="ml-2 text-amber-500 font-medium">
                      • Members Only (Tier {post.membershipTier})
                    </span>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => onEdit(post)}>
                                    <PenLine size={16} className="mr-1"/> Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                        setOpen(true);
                                        setDeletingId(post.postId);
                                    }}
                                    disabled={deletingId === post.postId}
                                >
                                    {deletingId === post.postId ? (
                                        <span className="animate-pulse">Deleting...</span>
                                    ) : (
                                        <>
                                            <Trash size={16} className="mr-1"/> Delete
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className={"flex flex-col items-center gap-4"}>
                        <div className={"w-[260px] md:w-[520px] xl:[720px] h-auto"}>
                            {
                                post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt={`${post.postSlug} image`}
                                        className={"object-cover w-full h-full rounded-md"}
                                    />
                                )
                            }
                        </div>

                        <p className="line-clamp-3">{post.content}</p>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                        <div className="flex gap-3">
                            <div><Eye size={14} className="inline mr-1"/>{post.views} views</div>
                            <div>❤️ {post.likesCount} likes</div>
                            <div>💬 {post.commentsCount} comments</div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}