// app/(pages)/explore/page.tsx
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {SearchCreators} from "@/components/search-creators/search-creators";
import {Post} from "@/app/(pages)/manage-posts/action"; // Ensure this type includes isMembersOnly and postSlug
import GetTopPosts from "@/app/(pages)/explore/action";
import Link from "next/link";
import {LockKeyhole} from "lucide-react"; // Import the lock icon

export default async function ExplorePage() {
    const posts: Post[] = await GetTopPosts();

    return (
        <div className="container mx-auto py-6 px-4 space-y-8">
            {/* Creator Search Section */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Explore Creators</h1>
                <p className="text-muted-foreground mb-6">
                    Find new and interesting creators to follow.
                </p>
                <div className="w-full md:w-1/2">
                    <SearchCreators/>
                </div>
            </div>

            <hr className="my-8"/>

            {/* Posts Feed Section */}
            <div>
                <h2 className="text-2xl font-semibold mb-6">Discover Posts</h2>
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link key={post.postId} href={`/posts/${post.postSlug}`} className="flex">
                                <Card className="flex flex-col w-full hover:shadow-lg transition-shadow duration-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={post.creatorProfilePicture || undefined}
                                                    alt={post.creatorName || "Author"}
                                                />
                                                <AvatarFallback>
                                                    {post.creatorName
                                                        ? post.creatorName.substring(0, 2).toUpperCase()
                                                        : "NA"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {post.creatorName || "Anonymous"}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col">
                                        <h3 className={`text-xl font-semibold mb-3 ${!post.title ? "text-center" : ""}`}>
                                            {post.title || "Untitled Post"}
                                        </h3>
                                        {post.isMembersOnly ? (
                                            <div
                                                className="flex-grow flex items-center justify-center bg-muted rounded-md mb-3 aspect-[16/9]">
                                                <LockKeyhole className="w-16 h-16 text-muted-foreground"/>
                                            </div>
                                        ) : post.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={post.imageUrl}
                                                alt={`Post by ${post.creatorName || "author"}`}
                                                className="w-full h-48 object-cover rounded-md mb-3"
                                            />
                                        ) : (
                                            <div
                                                className="flex-grow flex items-center justify-center bg-muted rounded-md mb-3 aspect-[16/9]">
                                                {/* Placeholder for posts without images and not members only */}
                                                <p className="text-sm text-muted-foreground">No image</p>
                                            </div>
                                        )}
                                        {/* Display a snippet of content if not members only, or a generic message */}
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                            {post.isMembersOnly ? "This post is for members only." : ""}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="text-xs text-muted-foreground pt-3 mt-auto">
                                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-10">
                        No posts to display yet.
                    </p>
                )}
            </div>
        </div>
    );
}