import {auth} from "@/auth";

export default async function Layout({children, creator}: {
    children: Readonly<React.ReactNode>,
    creator: React.ReactNode
}) {
    const session = await auth();

    return (
        <>
            {children}
            {session?.user.role === "creator" && creator}
        </>
    )
}