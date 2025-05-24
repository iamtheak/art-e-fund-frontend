import {getUserFromSession} from "@/global/helper";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import NavList from "@/components/nav-bar/nav-list";

const NavBar = async () => {

    const user = await getUserFromSession();
    const isCreator = user?.role === "creator";
    const isUser = user?.role === "user";
    const isAdmin = user?.role === "admin";
    let avatarFallback = "AF";
    if (user != null) {
        // Corrected avatar fallback logic
        const firstNameInitial = user?.firstName?.[0]?.toUpperCase() ?? "A";
        const lastNameInitial = user?.lastName?.[0]?.toUpperCase() ?? "F";
        avatarFallback = `${firstNameInitial}${lastNameInitial}`;
    }

    return (
        // Updated className for theme compatibility
        <header className={"w-full bg-background shadow-md sticky top-0 z-50 border-b border-border"}>
            <nav className=" max-w-[1290px] m-auto flex justify-between py-3 px-5 align-middle rounded-md">
                <div className={"w-[10%] flex justify-center items-center gap-5"}>
                    <Avatar>
                        <AvatarFallback> {avatarFallback}</AvatarFallback>
                    </Avatar>
                </div>
                <NavList isAdmin={isAdmin} isUser={isUser} isCreator={isCreator} username={user?.userName ?? ""}/>
            </nav>
        </header>
    )
}
export default NavBar;