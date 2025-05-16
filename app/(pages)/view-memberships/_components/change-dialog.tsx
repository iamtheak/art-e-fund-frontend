"use client";
// app/(pages)/view-memberships/_components/edit-dialog.tsx
import {Dispatch, SetStateAction} from "react";
import BaseDialog from "@/components/base-dialog/base-dialog";
import {TEnrolledMembership, TMembership} from "@/global/types";
import {GetCreatorMembershipByCreatorId} from "@/app/[username]/action";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Card, CardContent} from "@/components/ui/card";
import {changeMembership} from "@/app/(pages)/view-memberships/action";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import Loader from "@/components/loader";

type EditDialogProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    creatorId: number | null;
    currentEM: TEnrolledMembership;
};

const ChangeDialog = ({isOpen, setIsOpen, creatorId, currentEM}: EditDialogProps) => {

    const currentEMId = currentEM?.membershipId;
    const router = useRouter();

    const {data: membershipsData, isLoading} = useQuery({
        queryKey: ["memberships", creatorId],
        queryFn: () => GetCreatorMembershipByCreatorId(creatorId ?? 0),
        enabled: !!creatorId,
        staleTime: Infinity,
    });

    const mutation = useMutation({
        mutationFn: async (membershipId: number) => {
            return changeMembership(membershipId);
        },
        onSuccess: (data) => {

            if (data) {
                toast({title: "Membership changed verfied", description: "You will be redirected to khalti "});
                router.push(data.payment_url);
            } else {
                toast({title: "Error", description: "Something went wrong"});
            }

            setIsOpen(false);
        },
        onError: (error) => {
            toast({title: "Error while creating membership", description: error.message, variant: "destructive"});
        }
    });

    return (
        <BaseDialog
            title="Edit Membership"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClose={() => setIsOpen(false)}
        >
            <div>
                <p>Select a membership to change to:</p>
            </div>
            <div className="flex gap-3 mt-5">
                {
                    mutation.isPending && <Loader/>
                }
                {
                    isLoading ? (
                        <div className="text-center py-4">Loading memberships...</div>
                    ) : membershipsData && membershipsData.length > 0 ? (
                        membershipsData.map((membership: TMembership) => membership.membershipId !== currentEMId && membership.membershipTier >= currentEM.membershipTier && (
                            <Card key={membership.membershipId}>
                                <CardContent className="mb-3">
                                    <div key={membership.membershipId} className="flex flex-col gap-4 p-4">
                                        <h3 className="text-lg font-semibold">{membership.membershipName}</h3>
                                        <p>Tier: {membership.membershipTier}</p>
                                        <p>{membership.membershipBenefits}</p>
                                        <p className="text-sm text-muted-foreground">Price:
                                            Rs.{membership.membershipAmount}</p>
                                        <button
                                            disabled={mutation.isPending}
                                            className="bg-blue-500 text-white rounded-md"
                                            onClick={async () => {
                                                await mutation.mutateAsync(membership.membershipId);
                                                setIsOpen(false);
                                            }}
                                        >
                                            Subscribe
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-4">No memberships available</div>
                    )
                }
            </div>
        </BaseDialog>
    );
};

export default ChangeDialog;