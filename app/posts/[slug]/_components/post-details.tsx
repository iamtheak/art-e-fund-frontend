// app/posts/[slug]/components/post-details.tsx
import {format} from "date-fns";
import {Calendar, Eye, Heart, MessageCircle, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Post} from "@/app/(pages)/manage-posts/action";
import {LikeButton} from "./like-button";

export function PostDetails({post, userId}: { post: Post; userId: number }) {

    return (
        <div>
            {/* Post Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={post.creatorProfilePicture} alt={post.creatorName}/>
                            <AvatarFallback><User size={20}/></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{post.creatorName}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar size={14} className="mr-1"/>
                                {format(new Date(post.createdAt), "MMM d, yyyy")}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 text-muted-foreground">
            <span className="flex items-center">
              <Eye size={16} className="mr-1"/> {post.views}
            </span>
                        <span className="flex items-center">
              <Heart size={16} className="mr-1"/> {post.likesCount}
            </span>
                        <span className="flex items-center">
              <MessageCircle size={16} className="mr-1"/> {post.commentsCount}
            </span>
                    </div>
                </div>

                {post.isMembersOnly && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-2 mb-4 text-sm">
                        This is members-only content for Tier {post.membershipTier} subscribers.
                    </div>
                )}
            </div>

            {/* Post Image */}
            {post.imageUrl && (
                <div className="mb-6">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-auto rounded-lg object-cover"
                    />
                </div>
            )}

            {/* Post Content */}
            <div className="prose max-w-none mb-8">
                {post.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>

            {/* Like Button */}
            <div className="flex justify-center mb-8">
                <LikeButton slug={post.postSlug} userId={userId} postId={post.postId}/>
            </div>
        </div>
    );
}