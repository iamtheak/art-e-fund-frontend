"use client"

import {AppSidebar} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import useClientSession from "@/hooks/use-client-session";
import {sideBarData, sideBarDataCreator} from "@/app/(pages)/data";

const Layout = ({children}: { children: Readonly<React.ReactNode> }) => {


    const data = useClientSession();
    console.log(data.user)

    return (
        <div>
            <SidebarProvider>
                <AppSidebar
                    data={data.user != null ? (data.user.role === "creator" ? sideBarDataCreator : sideBarData) : sideBarData}>
                    <div className={"w-full mt-5 flex justify-center"}>
                        <Button className={"w-[70%]"}>Become a creator</Button>
                    </div>
                </AppSidebar>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarProvider>
        </div>
    );
};

export default Layout;
