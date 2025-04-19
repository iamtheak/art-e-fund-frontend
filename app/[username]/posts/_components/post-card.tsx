// app/[username]/posts/_components/post-card.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Calendar, Lock } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Post } from "@/app/(pages)/manage-posts/action";

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${post.postSlug}`);
  };

  // Apply Cloudinary blur transformation for members-only content
  const getImageUrl = (url: string) => {
    if (post.isMembersOnly && url.includes('cloudinary.com')) {
      // Insert blur transformation before upload part of URL
      return url.replace('/upload/', '/upload/e_blur:800,q_50/');
    }
    return url;
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="relative">
        {post.imageUrl ? (
          <div className="w-full h-48 relative">
            <Image
              src={getImageUrl(post.imageUrl)}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {post.isMembersOnly && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Lock className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
        ) : post.isMembersOnly ? (
          <div className="w-full h-32 bg-amber-50 flex items-center justify-center">
            <Lock className="w-10 h-10 text-amber-600" />
          </div>
        ) : null}

        {post.isMembersOnly && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            Tier {post.membershipTier} Content
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>

      <CardContent>
        {post.isMembersOnly ? (
          <div className="flex items-center space-x-2 text-amber-600 text-sm">
            <Lock size={14} />
            <span>Unlock this exclusive content</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.content}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between text-xs text-muted-foreground pt-0">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {format(new Date(post.createdAt), "MMM d, yyyy")}
        </div>
        <div className="flex space-x-3">
          <span className="flex items-center">
            <Heart size={14} className="mr-1" /> {post.likesCount}
          </span>
          <span className="flex items-center">
            <MessageCircle size={14} className="mr-1" /> {post.commentsCount}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}