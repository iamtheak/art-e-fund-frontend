// app/posts/[slug]/_components/comment-section.tsx
"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {format} from "date-fns";
import {addComment, getPostComments} from "../action";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Post} from "@/app/(pages)/manage-posts/action";

export function CommentSection({postId, slug, userId}: { postId: number, slug: string, userId: number }) {
    const [commentText, setCommentText] = useState("");
    const {toast} = useToast();
    const queryClient = useQueryClient();

    // Get comments from React Query cache
    const {data: comments = []} = useQuery({
        queryFn: () => getPostComments(postId),
        queryKey: ["comments", postId],
    });


    // Add comment mutation
    const commentMutation = useMutation({
        mutationFn: () => addComment(postId, commentText),
        onSuccess: (newComment) => {
            setCommentText("");

            // Update comments in cache
            queryClient.setQueryData(
                ["comments", postId],
                [newComment, ...comments]
            );

            // Update post comment count
            const post = queryClient.getQueryData<Post>(["post", slug]);
            if (post) {
                queryClient.setQueryData(["post", slug], {
                    ...post,
                    commentsCount: post.commentsCount + 1,
                });
            }

            toast({title: "Success", description: "Comment added successfully"});
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add comment",
                variant: "destructive",
            });
        },
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast({
                title: "Authentication required",
                description: "Please sign in to comment",
                variant: "destructive",
            });
            return;
        }

        if (!commentText.trim()) {
            toast({
                title: "Error",
                description: "Comment cannot be empty",
                variant: "destructive",
            });
            return;
        }

        commentMutation.mutate();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
                <Textarea
                    placeholder="Write a comment..."
                    className="mb-3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={commentMutation.isPending || !userId}
                    rows={3}
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={commentMutation.isPending || !commentText.trim() || !userId}
                    >
                        {commentMutation.isPending ? "Posting..." : "Post Comment"}
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.commentId}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={comment.userProfilePicture}/>
                                            <AvatarFallback><User size={14}/></AvatarFallback>
                                        </Avatar>
                                        <CardTitle className="text-sm font-medium">{comment.userName}</CardTitle>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {format(new Date(comment.commentedAt), "MMM d, yyyy • h:mm a")}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>{comment.commentText}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}