import NavBar from "@/components/nav-bar/nav-bar";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Layout({children, params}: {
    children: React.ReactNode,
    params: { username: string },
}) {

    return (<>
            <NavBar/>
            <main className="max-w-[1080px] m-auto">

                <div className={"flex justify-center items-center flex-col"}>
                    <div className={"w-full bg-mint h-80"}>
                    </div>

                    <div className={"w-full mt-[-20px]  px-5 py-2 rounded-md bg-emerald"}>

                        <div className={"w-full flex justify-between"}>
                            <div className={"flex justify-center gap-6"}>
                                <Avatar className={"w-32 h-32"}>
                                    <AvatarImage className={"w-full h-full"} src={"https://github.com/shadcn.png"}
                                                 alt={"Avatar"}/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div>
                                    <h1 className={"text-3xl"}>{params.username}</h1>
                                    <p className={"text-gray-500"}>This is the page of {params.username}</p>
                                </div>
                            </div>

                            <div className={"flex gap-2 justify-items-start items-end flex-col"}>
                                <div className={"flex gap-3"}>

                                    <Button>
                                        Donate
                                    </Button>
                                    <Button>
                                        Follow
                                    </Button>
                                </div>

                                <span>
                                    Join 3000 followers
                                </span>
                            </div>
                        </div>

                        <div className={"flex justify-center gap-5 items-center bg-emerald mt-5 "}>
                            <Link
                                href={`/${params.username}`}
                                className={`w-24 text-center pb-1 border-b-4 border-white}`}
                            >
                                About
                            </Link>
                            <Link
                                href={`/${params.username}/posts`}
                                className={`w-24 text-center pb-1 border-b-2 border-white }`}
                            >
                                Posts
                            </Link>
                            <Link
                                href={`/${params.username}/memberships`}
                                className={`w-24 text-center pb-1 border-b-2 border-white}`}
                            >
                                Memberships
                            </Link>
                        </div>
                    </div>

                </div>
                {children}
            </main>
        </>
    )
}