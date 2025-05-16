import NavBar from "@/components/nav-bar/nav-bar";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import CreatorAvatar from "@/app/[username]/_components/avatar";
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
            <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                <div
                    className="relative w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-mint/80 to-mint overflow-hidden">
                    {creator.creatorBanner ? (
                        <CreatorBanner image={creator.creatorBanner}/>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-yinmn-blue to-blue-700"/>
                    )}

                    {isSameUser && <BannerDialogContent creator={creator}/>}
                </div>

                <div className="max-w-[1080px] mx-auto px-4 relative">
                    {/* Profile Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-10 mb-6">
                        <div
                            className="w-44 h-44 flex items-center justify-center border-white border-4 rounded-full overflow-hidden shadow-lg">
                            {isSameUser ? (
                                <CreatorAvatar user={auth}/>
                            ) : (
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
                            )}
                        </div>

                        <div
                            className="flex flex-col md:flex-row items-center md:items-end justify-between w-full pb-3 gap-4">
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold">{creator.userName}</h1>
                                <p className="text-gray-600 mt-1 max-w-md line-clamp-2">
                                    {creator.creatorBio || "Creator on our platform"}
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-2">
                                {!isSameUser && (
                                    <div className="flex gap-3">
                                        <DonationDialog userName={creator.userName} creatorId={creator.creatorId}/>
                                    </div>
                                )}
                                <span className="text-sm text-gray-600">
                                    <FollowButton creatorId={creator.creatorId} isSameUser={isSameUser}/>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}

                    {
                        !isSameUser &&
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex space-x-8 overflow-x-auto">
                                <Link
                                    href={`/${creator.userName}`}
                                    className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors
                  ${parameters.username && !parameters.segment?.includes('/mem') ?
                                        'border-yinmn-blue text-yinmn-blue' :
                                        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    About
                                </Link>

                                {(creator.hasPosts || isSameUser) && (
                                    <Link
                                        href={`/${creator.userName}/posts`}
                                        className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors
                    ${parameters.username && parameters.segment?.includes('/manage-posts') ?
                                            'border-yinmn-blue text-yinmn-blue' :
                                            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Posts
                                    </Link>
                                )}

                                {(creator.hasMembership || isSameUser) && (
                                    <Link
                                        href={`/${creator.userName}/memberships`}
                                        className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors
                                            ${parameters.username && parameters.segment?.includes('/memberships') ?
                                            'border-yinmn-blue text-yinmn-blue' :
                                            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Memberships
                                    </Link>
                                )}
                            </nav>
                        </div>
                    }

                    <div className="pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}