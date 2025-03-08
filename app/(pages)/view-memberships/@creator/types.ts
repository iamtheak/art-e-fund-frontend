import {membershipSchema} from "@/app/(pages)/view-memberships/@creator/validator";
import z from "zod";
import {TMembership} from "@/global/types";
import {QueryObserverResult, RefetchOptions} from "@tanstack/query-core";
import {Dispatch, SetStateAction} from "react";

export type TMembershipForm = z.infer<typeof membershipSchema>;


export type TMembershipDialogProps = {
    action: (data: TMembership) => Promise<string>,
    defaultValues?: TMembership
    refetch?: (options?: RefetchOptions) => Promise<QueryObserverResult<TMembership[] | null, Error>>
    setOpen: Dispatch<SetStateAction<boolean>>
}