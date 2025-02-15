import {AppSidebar, TSideBarData} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {sideBarData, sideBarDataCreator} from "@/app/(pages)/data";
import {auth} from "@/auth";
import Link from "next/link";
import NavBar from "@/components/nav-bar/nav-bar";

const Layout = async ({children}: { children: Readonly<React.ReactNode> }) => {
    const session = await auth();

    let data: TSideBarData = sideBarData;
    const isCreator = session?.user.role === "creator";
    if (isCreator) {
        data = sideBarDataCreator;
    }
    return (
        <>
            <NavBar/>
            <main className={"flex flex-1 flex-col "}>
                <SidebarProvider>
                    <AppSidebar
                        data={data}
                    >
                        <div className={"w-full mt-5 flex justify-center"}>
                            {!isCreator ? <Button className={"w-[70%]"} asChild>
                                    <Link href={"/new-signin/new-creator"}>
                                        Upgrade to creator
                                    </Link>
                                </Button> :
                                <Button asChild>
                                    <Link href={"/" + session?.user.userName}>
                                        My Page
                                    </Link>
                                </Button>}
                        </div>
                    </AppSidebar>
                    <SidebarInset>

                        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
                    </SidebarInset>
                </SidebarProvider>
            </main>
        </>
    )
        ;
};

export default Layout;
