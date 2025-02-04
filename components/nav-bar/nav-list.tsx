"use client"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect} from "next/navigation";

export default function NavList({isUser, isCreator, username}: {
    isUser: boolean,
    isCreator: boolean,
    username: string
}) {

    const buttonClass = "bg-emerald h-8 text-white rounded-md py-2 px-4";
    return (
        <div className={"flex justify-between items-center w-[15%] "}>
            {
                isUser ? !isCreator ?
                        <Button className={buttonClass}>Become a Creator</Button> :
                        <Button className={buttonClass} onClick={() => {
                            redirect(`/${username}`)
                        }}>Your page</Button> :
                    <Link className={"hover:underline"} href={"/login"}>Login</Link>
            }
            <Link href={"/home"} className={"hover:underline"}>Home</Link>
        </div>
    )
}