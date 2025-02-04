import Link from "next/link";

export default function Layout({children}: { children: Readonly<React.ReactNode> }) {

    console.log(children);
    return (
        <main className={"flex items-center justify-center w-full h-[100dvh]"}>
            <div
                className={"flex items-center justify-center flex-col w-1/2 rounded-md p-2 bg-neutral-300 shadow-md"}>
                <div className={"text-center mb-5"}>
                    <h1 className={"text-[40px] font-bold"}>Hello New Creator ❤️!</h1>

                    <p>Here you can create a new creator account.</p>
                    {children}
                </div>
            </div>
        </main>
    )
}