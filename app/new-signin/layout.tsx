import {NewCreatorProvider} from "@/providers/new-creator/provider";

export default function Layout({children}: { children: React.ReactNode }) {

    return (<main className={"flex h-[100vh] justify-center items-center"}>
        <NewCreatorProvider>
            {children}
        </NewCreatorProvider>
    </main>);
}