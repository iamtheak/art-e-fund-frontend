"use client"
import {TEnrolledMembership, TMembership} from "@/global/types";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useMutation, useQuery} from "@tanstack/react-query";
import {EnrollMembership, GetEMByUserIdMembershipId} from "@/app/[username]/action";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

export type TMembershipProfileCardProps = {
    membership: TMembership
}
export default function MembershipProfileCard({membership}: TMembershipProfileCardProps) {

    const session = useSession()
    const router = useRouter()

    const {data: enrolledMembership} = useQuery<TEnrolledMembership>({
        queryKey: ["membership", membership.membershipId],
        queryFn: () => GetEMByUserIdMembershipId(session.data !== null ? session.data.user.userId : 0, membership.membershipId),
        enabled: session.status === "authenticated",
        retry: false
    })

    const mutation = useMutation({
        mutationFn: () => EnrollMembership(membership.membershipId),
        onSuccess: (data) => {
            if (!data) {
                toast({"title": "Error", "description": "Something went wrong", variant: "destructive"})
                return
            }
            toast({"title": "Success", "description": "Your request has been verified and will be redirecting you"})

            router.push(data.payment_url)
        },
        onError: (error) => {
            toast({"title": "Error", "description": error.message})
        }
    })
    return (
        <Card className={"w-full lg:w-[320px] md:h-[300px] flex flex-col gap-4 justify-between"}>
            <CardHeader>
                <h1 className={"text-xl font-bold"}>{membership.membershipName}</h1>
            </CardHeader>
            <CardContent className={"flex flex-col gap-4"}>
                <p>
                    Rs: {membership.membershipAmount}/month
                </p>
                <Button disabled={mutation.isPending || enrolledMembership?.isActive} onClick={async () => {
                    if (session.status !== "authenticated") {
                        toast({title: "Error", description: "You need to be logged in to enroll in a membership"})
                        return
                    }
                    await mutation.mutateAsync()
                }} className={"w-full rounded-full"}>
                    {enrolledMembership?.isActive ? "Enrolled" : "Enroll"}
                </Button>
            </CardContent>
            <CardFooter>
                <p>{membership.membershipBenefits}</p>
            </CardFooter>
        </Card>
    )
}