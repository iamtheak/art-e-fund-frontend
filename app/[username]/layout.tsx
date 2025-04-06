import NavBar from "@/components/nav-bar/nav-bar";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import CreatorAvatar from "@/app/[username]/_components/avatar";
import {getUserFromSession, isValidUsername} from "@/global/helper";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import CreatorBanner from "@/app/[username]/_components/creator-banner/creator-banner";
import axiosInstance from "@/config/axios";
import {TCreator} from "@/global/types";
import {API_ROUTES} from "@/config/routes";
import {notFound} from "next/navigation";
import BannerDialogContent from "@/app/[username]/_components/creator-banner/dialog-content";
import Image from "next/image";
import DonationDialog from "@/app/[username]/_components/donation-dialog/donation-dialog";

export default async function Layout({children, params}: {
    children: React.ReactNode,
    params: { username: string },
}) {

    const auth = await getUserFromSession();
    const paramData = await params;
    if (paramData.username === "error" || !isValidUsername(paramData.username)) {
        notFound()
    }
    const isSameUser = auth?.userName === paramData.username;
    let creator: TCreator | null = null;

    try {
        const response = await axiosInstance.get<TCreator>(API_ROUTES.CREATOR.USERNAME + paramData.username)
        creator = response.data;
    } catch {
        notFound()
    }

    return (<>
            <NavBar/>
            <main className="max-w-[1080px] relative m-auto">

                <div className={" relative flex justify-center items-center flex-col"}>

                    {creator?.creatorBanner ? <CreatorBanner image={creator?.creatorBanner}/> :
                        <div className={"w-full bg-mint h-80"}>
                        </div>
                    }

                    {
                        isSameUser && <BannerDialogContent creator={creator}/>
                    }

                    <div className={"w-full z-20 px-5 py-2 rounded-md bg-emerald"}>

                        <div className={"w-full flex justify-between"}>
                            <div className={"flex justify-center gap-6"}>

                                {
                                    isSameUser ?
                                        <CreatorAvatar user={auth}/>
                                        :
                                        (<Avatar className={"w-40 h-40"}>

                                            {
                                                creator?.profilePicture &&
                                                <Image src={creator?.profilePicture} fill
                                                       alt={"Profile picture of " + creator?.userName}/>
                                            }

                                            <AvatarFallback>{creator?.userName}</AvatarFallback>
                                        </Avatar>)
                                }

                                <div className={"w-[40%] relative"}>
                                    <h1 className={"text-3xl"}>{creator?.userName}</h1>
                                    <p className={"text-gray-500 w-full"}>This is the page of {creator?.userName}</p>
                                </div>
                            </div>

                            <div className={"flex gap-2 justify-items-start items-end flex-col"}>
                                {
                                    !isSameUser &&
                                    <div className={"flex gap-3"}>
                                        <DonationDialog userName={creator?.userName} creatorId={creator?.creatorId}/>
                                        <Button>
                                            Follow
                                        </Button>
                                    </div>
                                }
                                <span>
                                    Join 3000 followers
                                </span>

                            </div>
                        </div>

                        <div className={"flex justify-center gap-5 items-center bg-emerald mt-5 "}>

                            {
                                creator?.hasPosts || creator?.hasMembership &&
                                <Link
                                    href={`/${creator?.userName}`}
                                    className={`w-24 text-center pb-1 border-b-4 border-white}`}
                                >
                                    About
                                </Link>
                            }
                            {
                                !isSameUser && creator?.hasPosts &&
                                <Link
                                    href={`/${creator?.userName}/posts`}
                                    className={`w-24 text-center pb-1 border-b-2 border-white }`}
                                >
                                    Posts
                                </Link>
                            }
                            {
                                !isSameUser && creator?.hasMembership &&
                                <Link
                                    href={`/${creator?.userName}/memberships`}
                                    className={`w-24 text-center pb-1 border-b-2 border-white}`}
                                >
                                    Memberships
                                </Link>
                            }
                        </div>
                    </div>
                </div>
                {children}
            </main>
        </>
    )
}