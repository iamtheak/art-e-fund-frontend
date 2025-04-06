import {Progress} from "@/components/ui/progress";
import Link from "next/link";
import {Icon} from "@iconify/react";
import Donate from "@/app/[username]/_components/donate-box/donate";
import {TCreator} from "@/global/types";
import {GetCreatorByUserName} from "@/app/[username]/action";
import {notFound} from "next/navigation";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ username: string }>;
}) {
    const slug = (await params).username;

    let creator: TCreator | null = null;

    const response = await GetCreatorByUserName(slug);

    if (response === undefined) {
        notFound()
    }
    creator = response;


    return (
        <div className={"flex gap-3 py-4"}>

            <div className={"w-[40%] flex flex-col gap-3"}>
                <div className={" p-5 bg-mint rounded-xl"}>
                    <p className={"mb-2"}>For his gambling addiction</p>

                    <Progress value={20} className={"w-1/2 h-4 bg-white"}/>

                    <span className={""}>
                        20% of 300$
                    </span>
                </div>

                <div className={"bg-mint rounded-xl p-5"}>

                    <h2 className={"text-2xl mb-4"}>
                        About {creator?.userName}
                    </h2>
                    <p className={"mb-2"}>
                        {creator?.creatorBio}
                    </p>

                    <div className={"flex justify-end gap-4"}>
                        <Link href={"https://instagram.com"}>
                            <Icon width={24} height={24} icon={"skill-icons:instagram"}/>
                        </Link>
                        <Link href={"https://facebook.com"}>
                            <Icon width={24} height={24} icon={"logos:facebook"}/>
                        </Link>
                        <Link href={"https://youtube.com"}>
                            <Icon width={24} height={24} icon={"logos:youtube-icon"}/>
                        </Link>
                    </div>

                </div>
            </div>

            <div className={"w-[60%]"}>
                <Donate userName={slug} creatorId={creator?.creatorId}/>
            </div>
        </div>
    );
}
