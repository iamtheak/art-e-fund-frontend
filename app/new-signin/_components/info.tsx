import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function InfoTab() {
    return (
        <Card className={"w-full"}>
            <CardHeader className={""}>
                <p className={"text-xl"}>
                    Tell the world about yourself
                </p>

            </CardHeader>
            <CardContent className={"w-full"}>
                <form className={"w-full flex flex-col gap-5"}>
                    <div>

                        <label htmlFor="bio">Bio</label>
                        <Input type={"text"} className={"w-full"}/>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <Textarea className={"w-full h-28 resize-none"}/>
                    </div>
                </form>

            </CardContent>
        </Card>
    );
}