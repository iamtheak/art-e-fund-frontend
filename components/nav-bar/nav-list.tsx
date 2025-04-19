"use client"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect} from "next/navigation";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {useIsMobile} from "@/hooks/use-mobile";

export default function NavList({isUser, isCreator, username}: {
    isUser: boolean,
    isCreator: boolean,
    username: string
}) {

    const buttonClass = "bg-emerald h-8 text-white rounded-md py-2 px-4";

    const isMobile = useIsMobile()
    return (
        <div className={"flex justify-center gap-5 items-center w-[25%] "}>
            {
                !isMobile && (

                    <Link href={"/home"} className={"hover:underline"}>Home</Link>
                )
            }
            {
                !isMobile && isUser ? !isCreator ?
                        <Button className={buttonClass}>Go Creator</Button> :
                        <Button className={buttonClass} onClick={() => {
                            redirect(`/${username}`)
                        }}>Your page</Button> :
                    <Link className={"hover:underline"} href={"/login"}>Login</Link>
            }
            {
                isMobile &&
                <SidebarTrigger/>
            }
        </div>
    )
}