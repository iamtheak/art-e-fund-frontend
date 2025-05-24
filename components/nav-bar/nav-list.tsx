"use client"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect} from "next/navigation";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {useIsMobile} from "@/hooks/use-mobile";
import {ModeToggle} from "@/components/landing-page/mode-toggle";

export default function NavList({isAdmin, isUser, isCreator, username}: {
    isUser: boolean,
    isCreator: boolean,
    username: string
    isAdmin?: boolean
}) {

    const buttonClass = "h-8 text-white  rounded-md py-2 px-4";

    const isMobile = useIsMobile()

    const isLoggedIn = isUser || isCreator || isAdmin;
    return (
        <div className={"flex justify-center gap-5 items-center w-[25%] "}>
            {
                !isMobile && (

                    <Link href={"/explore"} className={"hover:underline"}>Home</Link>
                )
            }

            {
                !isMobile && isLoggedIn ? !isCreator ?
                    <Button className={buttonClass}>Go Creator</Button> :
                    <Button className={buttonClass} onClick={() => {
                        redirect(`/${username}`)
                    }}>Your page</Button> : isAdmin ? null :
                    <Link className={"hover:underline"} href={"/login"}>Login</Link>
            }
            {
                !isMobile && <ModeToggle/>
            }
            {
                isMobile &&
                <SidebarTrigger/>
            }
        </div>
    )
}