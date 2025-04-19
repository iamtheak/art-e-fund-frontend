// app/[username]/posts/page.tsx
import {GetPostsByUsername} from "@/app/[username]/action";
import PostCard from "./_components/post-card";
import {Metadata} from "next";

export async function generateMetadata({params}: { params: { username: string } }): Promise<Metadata> {


    const parameters = await params
    return {
        title: `Posts by ${parameters.username}`,
        description: `View all content created by ${parameters.username}`
    };
}

export default async function CreatorPosts({
                                               params,
                                           }: {
    params: { username: string };
}) {
    const parameters = await params
    const username = parameters.username;
    const posts = await GetPostsByUsername(username);

    if (!posts || posts.length === 0) {
        return (
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Posts by {username}</h1>
                <p className="text-muted-foreground text-center py-12">
                    This creator hasn't published any posts yet.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Posts by {username}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.postId} post={post}/>
                ))}
            </div>
            <div className="flex justify-center mt-6">
                <button className="bg-mint text-white px-4 py-2 rounded-md">
                    Load More
                </button>
            </div>
        </div>
    );
}