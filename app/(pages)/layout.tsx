import {ReactNode, Suspense} from "react"
import Link from "next/link"
import {AppSidebar, type TSideBarData} from "@/components/app-sidebar"
import {Button} from "@/components/ui/button"
import NavBar from "@/components/nav-bar/nav-bar"
import {sideBarAdminData, sideBarData, sideBarDataCreator} from "@/app/(pages)/data"
import {getUserFromSession} from "@/global/helper";
import Loader from "@/components/loader";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps) => {
    const user = await getUserFromSession()
    const isCreator = user?.role === "creator"
    const isAdmin = user?.role === "admin"


    const data: TSideBarData = isCreator ? sideBarDataCreator : isAdmin ? sideBarAdminData : sideBarData

    return (
        <>
            <div>
                <AppSidebar data={data}>
                    {
                        !isAdmin &&
                        <div className="w-full mt-5 flex justify-center">
                            <Button className="w-[70%]" asChild>
                                <Link href={isCreator ? `/${user?.userName}` : "/new-signin/new-creator"}>
                                    {isCreator ? "My Page" : "Upgrade to creator"}
                                </Link>
                            </Button>
                        </div>
                    }
                </AppSidebar>
            </div>
            <div className="w-full flex flex-col justify-center">
                <NavBar/>
                <div className="flex flex-1 flex-col gap-4 p-4 mt-5">
                    <Suspense fallback={<Loader/>}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </>
    )
}

export default Layout

