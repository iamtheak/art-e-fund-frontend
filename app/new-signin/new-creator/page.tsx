"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import ContentTab from "@/app/new-signin/_components/content";
import InfoTab from "@/app/new-signin/_components/info";

export default function NewCreator() {

    const contents: {
        contentId: number,
        contentType: string
    }[] = [{contentId: 1, contentType: "Informative content"}, {
        contentId: 2,
        contentType: "Fashion"
    }, {contentId: 3, contentType: "Art"}, {contentId: 4, contentType: "Music"}, {
        contentId: 5,
        contentType: "Podcasts"
    }, {contentId: 6, contentType: "Other"}];


    const [currentTab, setCurrentTab] = useState<"content" | "info" | "payment">("content");

    const [choosenContent, setChoosenContent] = useState<number | null>(null);


    return (
        <div className={"flex items-center justify-center flex-col w-1/2 rounded-md p-2 bg-neutral-300 shadow-md"}>
            <div className={"text-center mb-5"}>
                <h1 className={"text-[40px] font-bold"}>Hello New Creator ❤️!</h1>

                <p>Here you can create a new creator account.</p>
            </div>

            <Tabs className={"w-full"} value={currentTab}>
                <TabsList className={"grid grid-cols-3"}>
                    <TabsTrigger onClick={()=> setCurrentTab("content")} value={"content"}>Choose the type of content</TabsTrigger>
                    <TabsTrigger onClick={()=> setCurrentTab("info")} value={"info"}>Write about yourself</TabsTrigger>
                    <TabsTrigger onClick={()=> setCurrentTab("payment")} value={"payment"}>Add you payment method</TabsTrigger>
                </TabsList>

                <TabsContent value={"content"}>
                    <ContentTab choosenContent={choosenContent} setCurrentTab={setCurrentTab} contents={contents} setChoosenContent={setChoosenContent}/>
                </TabsContent>
                <TabsContent value={"info"}>
                    <InfoTab/>
                </TabsContent>
            </Tabs>
        </div>
    );
}