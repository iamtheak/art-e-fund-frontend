import {TMembership} from "@/global/types";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export type TMembershipProfileCardProps = {
    membership: TMembership
}
export default function MembershipProfileCard({membership}: TMembershipProfileCardProps) {

    return (
        <Card className={"md:h-[300px] flex flex-col gap-4 justify-between"}>
            <CardHeader>
                <h1 className={"text-xl font-bold"}>{membership.membershipName}</h1>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <p>
                    Rs: {membership.membershipAmount}/month
                </p>
                <Button className={"w-full rounded-full"}>
                    Join membership
                </Button>
            </CardContent>
            <CardFooter>
                <p>{membership.membershipBenefits}</p>
            </CardFooter>
        </Card>
    )
}