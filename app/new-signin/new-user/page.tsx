import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";

export default function NewUser() {

    return (
        <div className={"h-full w-full flex justify-center items-center flex-col"}>

            <Card className={" w-50vh flex flex-col justify-between"}>
                <CardHeader>
                    <h1 className={"text-4xl text-center"}>Hello New User</h1>
                    <p>You have signed in as a new user do you wish to be a creator ?</p>
                    <p>Creators can receive donations from different users !!</p>
                </CardHeader>
                <CardContent className={"flex gap-2 flex-col"}>

                    <div>

                        <h2 className={"text-xl mb-3"}>
                            Benefits of being a creator
                        </h2>


                        <div className={"pl-5"}>
                            <ul className={"list-disc"}>
                                <li>Receive donation</li>
                                <li>Add memberships</li>
                                <li>Add posts</li>
                                <li>View analytics</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={"flex justify-center gap-5"}>
                    <Button asChild>
                        <Link href={"/home"}>Continue</Link>
                    </Button>
                    <Button asChild>
                        <Link href={"/new-signin/new-creator"}>Become a creator</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}