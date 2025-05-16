import * as React from "react"

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from "@/components/ui/sidebar"
import {signOut} from "@/auth";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";

export type TSideBarData = {
    navMain: {
        title: string
        url: string
        items: {
            title: string
            url: string
            isActive?: boolean
        }[]
    }[]
}

export function AppSidebar({data, children, ...props}: {
    data: TSideBarData,
    children?: React.ReactNode,
    props?: React.ComponentProps<typeof Sidebar>
}) {


    return (
        <Sidebar {...props} collapsible={"offcanvas"} variant={"inset"}>
            <SidebarContent className="bg-white border-r relative">
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.isActive}>
                                            <a href={item.url}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
                {children}
                <SidebarFooter>
                   <LogoutButton />
                </SidebarFooter>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
