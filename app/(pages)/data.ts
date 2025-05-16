import {TSideBarData} from "@/components/app-sidebar";

export const sideBarData: TSideBarData = {
    navMain: [
        {
            title: "Main",
            url: "/",
            items: [
                {
                    title: "Explore",
                    url: "/explore",
                    isActive: true
                }
            ]
        },
        {
            title: "Donate",
            url: "/donations",
            items: [
                {
                    title: "View Donations",
                    url: "/view-donations",
                },
                {
                    title: " View Memberships",
                    url: "/view-memberships",
                }
            ]
        },
        {
            title: "Settings",
            url: "/settings",
            items: [
                {
                    title: "Profile",
                    url: "/profile",
                },
                {
                    title: "Account",
                    url: "/account",
                },
            ]
        }
    ]
}

export const sideBarDataCreator: TSideBarData = {
    navMain: [
        {
            title: "Main",
            url: "/",
            items: [
                {
                    title: "Home",
                    url: "/home",
                    isActive: true
                },
                {
                    title: "Explore",
                    url: "/explore",
                }
            ]
        },
        {
            title: "Content",
            url: "/donations",
            items: [
                {
                    title: "View Donations",
                    url: "/view-donations",
                },
                {
                    title: " View Memberships",
                    url: "/view-memberships",
                },
                {
                    title: "Posts",
                    url: "/manage-posts"
                }
            ]
        },
        {
            title: "Settings",
            url: "/settings",
            items: [
                {
                    title: "Profile",
                    url: "/profile",
                },
                {
                    title: "Account",
                    url: "/account",
                },
            ]
        }
    ]
}
