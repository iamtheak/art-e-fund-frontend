import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";
import {Provider} from "../providers/provider";
import QueryProvider from "@/providers/query-provider";
import {SidebarProvider} from "@/components/ui/sidebar";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Artefund",
    description: "Creator support application that is created for the creators.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Provider>
            <QueryProvider>
                <SidebarProvider className={"flex"}>
                    {children}
                </SidebarProvider>
            </QueryProvider>
        </Provider>
        <Toaster/>
        </body>
        </html>
    )
        ;
}
