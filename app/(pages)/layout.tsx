import type {ReactNode} from "react"
import Link from "next/link"
import {AppSidebar, type TSideBarData} from "@/components/app-sidebar"
import {Button} from "@/components/ui/button"
import NavBar from "@/components/nav-bar/nav-bar"
import {sideBarData, sideBarDataCreator} from "@/app/(pages)/data"
import {getUserFromSession} from "@/global/helper";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps) => {
    const user = await getUserFromSession()
    const isCreator = user?.role === "creator"

    // Determine which sidebar data to use based on user role
    const data: TSideBarData = isCreator ? sideBarDataCreator : sideBarData

    return (
        <>
            <div>
                <AppSidebar data={data}>
                    <div className="w-full mt-5 flex justify-center">
                        <Button className="w-[70%]" asChild>
                            <Link href={isCreator ? `/${user?.userName}` : "/new-signin/new-creator"}>
                                {isCreator ? "My Page" : "Upgrade to creator"}
                            </Link>
                        </Button>
                    </div>
                </AppSidebar>
            </div>
            <div className="w-full flex flex-col justify-center">
                <NavBar/>
                <div className="flex flex-1 flex-col gap-4 p-4 mt-5">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout

