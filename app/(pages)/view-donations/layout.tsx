export default function Layout({children, creator}: {
    children: Readonly<React.ReactNode>,
    creator: React.ReactNode
}) {
    return (
        <>
            {children}
            {creator}
        </>
    )
}