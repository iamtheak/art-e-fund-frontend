// app/posts/[slug]/page.tsx
import {getPostBySlug, getPostComments, getPostLikes, getPostViewAccess} from "./action";
import {Metadata} from "next";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import PostContainer from "./_components/post-container";
import {getUserFromSession} from "@/global/helper";
import {Post} from "@/app/(pages)/manage-posts/action";
import NoAccess from "@/app/posts/[slug]/_components/no-access";
import Link from "next/link";
import {Button} from "@/components/ui/button"; // Import Button component
import {ChevronLeft} from "lucide-react"; // Import an icon for the button

export async function generateMetadata({params}: { params: { slug: string } }): Promise<Metadata> {


    const parameters = await params;
    const slug = parameters.slug;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Post not found",
            description: "The requested post could not be found.",
            openGraph: {
                title: "Post not found",
                description: "The requested post could not be found.",
            },
        };
    }
    return {
        title: post.title,
        description: post.content.substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160),
            images: post.imageUrl ? [post.imageUrl] : [],
        },
    };
}

export default async function PostPage({params}: { params: { slug: string } }) {

    const parameters = await params
    const slug = parameters.slug;
    const queryClient = new QueryClient();
    const user = await getUserFromSession()
    let userId = user?.userId ?? 0;

    if (userId !== 0) {
        userId = Number(userId);
    }

    await queryClient.prefetchQuery({
        queryKey: ["post", slug],
        queryFn: () => getPostBySlug(slug),
    });


    // Get post from cache to prefetch related data
    const post = queryClient.getQueryData(["post", slug]) as Post;


    if (userId == 0 && post?.isMembersOnly) {
        return (<NoAccess/>)
    } else {
        const access = await getPostViewAccess(post?.postId ?? 0, userId);

        if (!access) {
            return (<NoAccess/>)
        }
    }


    if (post?.postId) {
        // Prefetch comments and likes
        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: ["comments", post.postId],
                queryFn: () => getPostComments(post.postId),
            }),
            queryClient.prefetchQuery({
                queryKey: ["likes", post.postId],
                queryFn: () => getPostLikes(post.postId),
            }),
        ]);
    }


    return (
        <div className="container mx-auto py-8">
            <div className="mb-6"> {/* Added margin-bottom for spacing */}
                <Link href="/explore" legacyBehavior>
                    <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4"/>
                        Back to Explore
                    </Button>
                </Link>
            </div>
            <div className="max-w-3xl mx-auto">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <PostContainer userId={userId} slug={slug}/>
                </HydrationBoundary>
            </div>
        </div>
    );
}