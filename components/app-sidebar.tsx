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
            {/* Updated className for theme compatibility */}
            <SidebarContent className="bg-background border-r border-border relative">
                {/* We create a SidebarGroup for each parent. */}
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((subItem) => ( // Changed item to subItem to avoid conflict
                                    <SidebarMenuItem key={subItem.title}>
                                        <SidebarMenuButton asChild isActive={subItem.isActive}>
                                            <a href={subItem.url}>{subItem.title}</a>
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