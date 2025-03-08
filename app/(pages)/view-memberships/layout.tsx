import {getUserFromSession} from "@/global/helper";

export default async function ViewMembershipsLayout({children, creator}: {
    children: Readonly<React.ReactNode>,
    creator: React.ReactNode,
}) {
    const user = await getUserFromSession();

    return (
        <>
            {user?.role === "creator" && creator}
            {children}
        </>
    )
}
