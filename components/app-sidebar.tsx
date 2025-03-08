import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from "@/components/ui/sidebar"

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
        <Sidebar {...props}  collapsible={"none"} variant={"sidebar"}>

            <SidebarContent>
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
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}
