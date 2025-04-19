"use client"
import {TEnrolledMembership, TMembership} from "@/global/types";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery} from "@tanstack/react-query";
import {EnrollMembership, GetEMByUserIdMembershipId} from "@/app/[username]/action";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";

export type TMembershipProfileCardProps = {
    membership: TMembership
}
export default function MembershipProfileCard({membership}: TMembershipProfileCardProps) {

    const session = useSession()

    const {data: enrolledMembership} = useQuery<TEnrolledMembership>({
        queryKey: ["membership", membership.membershipId],
        queryFn: () => GetEMByUserIdMembershipId(session.data !== null ? session.data.user.userId : 0, membership.membershipId),
        enabled: session.status === "authenticated",
        retry: false
    })

    const mutation = useMutation({
        mutationFn: () => EnrollMembership(membership.membershipId),
        onSuccess: () => {
            toast({"title": "Success", "description": "Membership enrolled successfully"})
        },
        onError: (error) => {
            toast({"title": "Error", "description": error.message})
        }
    })
    return (
        <Card className={"md:h-[300px] flex flex-col gap-4 justify-between"}>
            <CardHeader>
                <h1 className={"text-xl font-bold"}>{membership.membershipName}</h1>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <p>
                    Rs: {membership.membershipAmount}/month
                </p>
                <Button disabled={mutation.isPending || !!enrolledMembership} onClick={async () => {
                    if (session.status !== "authenticated") {
                        toast({title: "Error", description: "You need to be logged in to enroll in a membership"})
                        return
                    }
                    await mutation.mutateAsync()
                }} className={"w-full rounded-full"}>
                    {!!enrolledMembership ? "Enrolled" : "Enroll"}
                </Button>
            </CardContent>
            <CardFooter>
                <p>{membership.membershipBenefits}</p>
            </CardFooter>
        </Card>
    )
}