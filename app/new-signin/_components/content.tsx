import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cn} from "@/components/lib/utils";
import {redirect, usePathname} from "next/navigation";

export default  function  ContentTab({contents, setChoosenContent, choosenContent}: {
    contents: { contentId: number, contentType: string }[],
    setChoosenContent: (contentId: number) => void,
    choosenContent: number | null,
}) {


    const currentRoute = usePathname();

    return (
        <Card>
            <CardHeader className={"text-xl text-center mb-5"}>
                Choose the type of content you will create !
            </CardHeader>

            <CardContent className={"flex justify-center items-center"}>

                <div className={"flex flex-wrap gap-5  justify-center items-center"}>

                    {contents.map((content) => {
                        return (<div onClick={() => {
                            setChoosenContent(content.contentId)
                        }} key={content.contentId}
                                     className={cn("p-5 bg-[#fafafa] hover:bg-neutral-200 min-w-44 flex items-center justify-center text-center cursor-pointer border-yinmn-blue border-2 rounded-[20px]  text-xl",
                                         choosenContent === content.contentId && "bg-neutral-200")}>
                            <p>
                                {content.contentType}
                            </p>
                        </div>)
                    })}
                </div>
                {}

            </CardContent>

            <CardFooter className={"flex gap-5 align-middle justify-end"}>

                <Button className={"h-11 w-20"}>
                    Back
                </Button>
                <Button onClick={() => {
                    redirect('/')
                }} className={"h-11 w-20"}>
                    Next
                </Button>
            </CardFooter>
        </Card>
    )
}