import {getUserFromSession} from "@/global/helper";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {redirect} from "next/navigation";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import NavList from "@/components/nav-bar/nav-list";

const NavBar = async () => {

    const user = await getUserFromSession();
    const isCreator = user?.role === "creator";
    const buttonClass = "bg-emerald h-8 text-white rounded-md py-2 px-4";
    let avatarFallback = "AF";
    if (user != null) {
        avatarFallback = user?.firstName[0].toString().toUpperCase() ?? "A" + user?.lastName[0].toUpperCase() ?? "F";
    }


    return (
        <header className={"w-full shadow-md"}>
            <nav className=" max-w-[1290px] m-auto flex justify-between py-3 px-2 align-middle">
                <div>
                    <Avatar>
                        <AvatarFallback> {avatarFallback}</AvatarFallback>
                    </Avatar>
                </div>
                <NavList isUser={user !== null} isCreator={isCreator} username={user?.userName ?? ""}/>
            </nav>
        </header>
    )
}
export default NavBar;