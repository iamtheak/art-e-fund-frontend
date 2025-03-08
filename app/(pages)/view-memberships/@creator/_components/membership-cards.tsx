"use client"

import {useMutation, useQuery} from "@tanstack/react-query";
import {
    createNewMembership, deleteMembership,
    getCreatorMemberships,
    updateMembership
} from "@/app/(pages)/view-memberships/@creator/action";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import {useState} from "react";
import BaseDialog from "@/components/base-dialog/base-dialog";
import MembershipDialog from "@/app/(pages)/view-memberships/@creator/_components/membership-dialog";
import {TMembership} from "@/global/types";
import {ConfirmationDialog} from "@/components/confirmation-dialog/confirmation-dialog";
import {useToast} from "@/hooks/use-toast";
import {PlusCircle} from "lucide-react";

export function MembershipCards({userName}: { userName: string }) {

    const [currentMembership, setCurrentMembership] = useState<TMembership>({} as TMembership)
    const actions = {
        "update": updateMembership,
        "create": createNewMembership
    }
    const [action, setAction] = useState<"update" | "create">("create")
    const [isOpen, setIsOpen] = useState(false)
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

    const {toast} = useToast()
    const {data: memberships, refetch} = useQuery({
        queryKey: ['creator', 'memberships'],
        queryFn: () => getCreatorMemberships(userName),
        staleTime: Infinity,
    })
    const mutation = useMutation({
        mutationFn: (membershipId: number) => deleteMembership(membershipId),
        onSuccess: (response: string) => {
            refetch()
            setIsConfirmationOpen(false)
            toast({title: "Success", description: response})
        },
        onError: (error) => {
            toast({title: "Error while deleting membership", description: error.message})
            setIsConfirmationOpen(false)
        }
    })

    return (
        <div className={"flex w-full flex-col  justify-end items-end gap-4"}>
            <Button className={"w-44"}  onClick={() => {

                if (memberships && memberships.length >= 4) {
                    toast({title: "Error", description: "You can only create 4 memberships"})
                    return
                }
                setCurrentMembership({} as TMembership)
                setAction("create")
                setIsOpen(true)
            }}>
                <PlusCircle className="h-4 w-4" />
                Create membership
            </Button>
            <BaseDialog title={"Update your membership"} isOpen={isOpen} setIsOpen={setIsOpen}>
                <MembershipDialog setOpen={setIsOpen} refetch={refetch} action={actions[action]}
                                  defaultValues={currentMembership}/>
            </BaseDialog>

            <ConfirmationDialog open={isConfirmationOpen} setOpen={setIsConfirmationOpen}
                                action={() => mutation.mutate(currentMembership.membershipId)}
                                title={"Delete Membership"}
                                description={"Do you want to delete this membership"}/>
            <div className={"w-full flex gap-5 flex-wrap"}>

                {memberships && memberships.sort((a, b) => a.membershipTier - b.membershipTier).map((membership) => (
                    <Card key={membership.membershipId} className="w-64 md:w-80 flex-shrink-0 snap-center">
                        <CardHeader>
                            <h2 className="text-2xl">{membership.membershipName}</h2>
                            <p>Tier:{membership.membershipTier}</p>
                        </CardHeader>
                        <CardContent className={"flex flex-col gap-2"}>
                            <div className={"max-h-32 overflow-hidden"}>
                                {membership.membershipBenefits}
                            </div>
                            <p>
                                Amount: {membership.membershipAmount}
                            </p>
                        </CardContent>
                        <CardFooter className={"flex gap-2 justify-end"}>
                            <Button onClick={() => {
                                setAction("update")
                                setCurrentMembership(membership)
                                setIsOpen(true)
                            }}>
                                <Icon icon="ri:edit-fill"/>
                            </Button>
                            <Button className={"bg-red-500 text-white"} onClick={() => {
                                setCurrentMembership(membership)
                                setIsConfirmationOpen(true)
                            }}>
                                <Icon icon="ri:delete-bin-6-fill"/>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>)
}