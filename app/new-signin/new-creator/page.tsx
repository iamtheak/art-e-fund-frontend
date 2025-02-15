import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import contentImage from "@/public/new-sigin/pexels-magda-ehlers-pexels-1054713.jpg";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function NewCreator() {

    return (
        <Card className={"flex items-center justify-center flex-col w-1/2 rounded-md p-2 shadow-md"}>
            <CardHeader className={"text-center mb-5"}>
                <h1 className={"text-[40px] font-bold"}>Hello New Creator ❤️!</h1>
                <p>Lets get your journey started right away ! </p>

            </CardHeader>
            <CardContent className={"w-full relative h-[50vh]"}>
                <Image src={contentImage} fill alt={"content creation"} className={"w-[80%] h-full object-cover"}/>
            </CardContent>

            <CardFooter className={"mt-5 flex gap-4 flex-col"}>
                <p>Ready to dive in?</p>
                <Button asChild>
                    <Link href={"/new-signin/content"}>Lets Go !</Link>
                </Button>
            </CardFooter>

        </Card>
    );
}