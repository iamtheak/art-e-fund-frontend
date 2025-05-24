import NavBar from "@/components/nav-bar/nav-bar";
import {getUserFromSession, isValidUsername} from "@/global/helper";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import CreatorBanner from "@/app/[username]/_components/creator-banner/creator-banner";
import BannerDialogContent from "@/app/[username]/_components/creator-banner/dialog-content";
import {AddProfileVisit, GetCreatorByUserName, getFollowStatus} from "./action";
import {notFound} from "next/navigation";
import Image from "next/image";
import DonationDialog from "@/app/[username]/_components/donation-dialog/donation-dialog";
import {Metadata} from "next";
import {QueryClient} from "@tanstack/react-query";
import FollowButton from "@/app/[username]/_components/folllow-button/follow-button";
import PageNavList from "@/app/[username]/_components/page-nav-list";
import {Suspense} from "react";
import Loader from "@/components/loader";


interface CreatorLayoutProps {
    children: React.ReactNode;
    params: { username: string, segment?: string };
}

export async function generateMetadata({params}: CreatorLayoutProps): Promise<Metadata> {

    const creator = await GetCreatorByUserName(params.username);

    if (!creator) {
        return {title: "Creator Not Found"};
    }

    return {
        title: `${creator.userName} | Creator Profile`,
        description: creator.creatorBio || `Support ${creator.userName} on our platform`,
    };
}

export default async function CreatorLayout({children, params}: CreatorLayoutProps) {

    const parameters = await params;
    const username = parameters.username;

    if (username === "error" || !isValidUsername(username)) {
        notFound();
    }

    const auth = await getUserFromSession();
    const creator = await GetCreatorByUserName(username);

    if (!creator) {
        notFound();
    }

    const isSameUser = auth?.userName === username;


    if (!isSameUser) {
        await AddProfileVisit(creator?.creatorId ?? 0);
    }


    const client = new QueryClient();

    await client.prefetchQuery({
        queryKey: ['followStatus', creator?.creatorId],
        queryFn: () => getFollowStatus(creator?.creatorId ?? 0),
    })
    return (
        <div className={"w-full relative"}>
            <NavBar/>
            {/* Updated main background for dark mode compatibility */}
            <main className="min-h-screen dark:slate-200">
                <div
                    className="relative w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r  overflow-hidden">
                    {creator.creatorBanner ? (
                        <CreatorBanner image={creator.creatorBanner}/>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r"/>
                    )}

                    {isSameUser && <BannerDialogContent creator={creator}/>}
                </div>

                <div className="max-w-[1080px] mx-auto px-4 relative">
                    {/* Profile Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-10 mb-6">
                        <div
                            className="w-44 h-44 flex items-center justify-center border-background border-4 rounded-full overflow-hidden shadow-lg">
                            {
                                <Avatar className="w-full h-full">
                                    {creator.profilePicture ? (
                                        <Image
                                            src={creator.profilePicture}
                                            fill
                                            alt={`Profile picture of ${creator.userName}`}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <AvatarFallback
                                            className="w-full h-full flex items-center justify-center bg-yinmn-blue text-white text-3xl">
                                            {creator.userName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            }
                        </div>

                        <div
                            className="flex flex-col md:flex-row items-center md:items-end justify-between w-full pb-3 gap-4">
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold">{creator.userName}</h1>
                                {/* Updated text color for theme compatibility */}
                                <p className="text-muted-foreground mt-1 max-w-md line-clamp-2">
                                    {creator.creatorBio || "Creator on our platform"}
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-2">
                                {!isSameUser && (
                                    <div className="flex gap-3">
                                        <DonationDialog userName={creator.userName} creatorId={creator.creatorId}/>
                                    </div>
                                )}
                                {/* Updated text color for theme compatibility */}
                                <span className="text-sm text-muted-foreground">
                                    <FollowButton creatorId={creator.creatorId} isSameUser={isSameUser}/>
                                </span>
                            </div>
                        </div>
                    </div>


                    {
                        !isSameUser &&
                        // Updated border color for theme compatibility
                        <PageNavList creator={creator}/>
                    }

                    <div className="pb-12">
                        <Suspense fallback={<Loader/>}>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </main>
        </div>
    );
}