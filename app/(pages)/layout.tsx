import {AppSidebar, TSideBarData} from "@/components/app-sidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {sideBarData, sideBarDataCreator} from "@/app/(pages)/data";
import {auth} from "@/auth";

const Layout = async ({children}: { children: Readonly<React.ReactNode> }) => {
    const session  = await auth();

    let data : TSideBarData = sideBarData;
    const isCreator = session?.user.role === "creator";
    if(isCreator){
        data = sideBarDataCreator;
    }
    return (
        <div>
            <SidebarProvider>
                <AppSidebar
                    data={data}>
                    <div className={"w-full mt-5 flex justify-center"}>
                        {!isCreator && <Button className={"w-[70%]"}>Upgrade to creator</Button>}
                    </div>
                </AppSidebar>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarProvider>
        </div>
    );
};

export default Layout;
