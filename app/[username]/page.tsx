import {Progress} from "@/components/ui/progress";
import Link from "next/link";
import {Icon} from "@iconify/react";
import Donate from "@/app/[username]/_components/donate";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ username: string }>;
}) {
    const slug = (await params).username;

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

                    <h2 className={"text-xl mb-4"}>
                        About {slug}
                    </h2>
                    <p className={"mb-2"}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer bibendum consectetur ante, sit
                        amet suscipit mi tempus eu. Mauris interdum turpis vel felis pharetra cursus. Maecenas feugiat
                        pharetra ultricies. In consequat, eros ac congue vulputate, purus eros dignissim eros, vel
                        eleifend lorem tortor sit amet dolor. Quisque iaculis vestibulum massa vel cursus. Sed aliquet,
                        dolor ac varius mattis, augue mi tempor ipsum, in pretium urna sem eget est. Duis suscipit magna
                        quis odio pulvinar scelerisque. Vivamus elit lectus, condimentum porta orci et, tempus porttitor
                        nibh. Fusce laoreet consectetur dui. Suspendisse potenti. Proin consectetur iaculis velit, sit
                        amet porttitor diam. Suspendisse potenti. Aliquam imperdiet id leo ac faucibus.
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
                <Donate username={slug}/>
            </div>
        </div>
    );
}
