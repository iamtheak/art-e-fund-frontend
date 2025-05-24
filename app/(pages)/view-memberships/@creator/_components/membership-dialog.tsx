"use client"
import {BaseInput} from "@/components/base-input/base-input";
import {useForm} from "react-hook-form";
import {TMembershipDialogProps, TMembershipForm} from "@/app/(pages)/view-memberships/@creator/types";
import {zodResolver} from "@hookform/resolvers/zod";
import {membershipSchema} from "@/app/(pages)/view-memberships/@creator/validator";
import {Form} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast";
import {useSession} from "next-auth/react";
import {TMembership} from "@/global/types";

export default function MembershipDialog({action, defaultValues, refetch, setOpen}: TMembershipDialogProps) {

    const form = useForm<TMembershipForm>({
        resolver: zodResolver(membershipSchema),
        defaultValues: defaultValues
    })

    const session = useSession()

    const mutation = useMutation({
        mutationFn: (formData: TMembershipForm) => {

            const data: TMembership = {
                ...formData,
                membershipId: defaultValues?.membershipId ?? 0,
                creatorId: session.data?.user?.creatorId ?? 0
            }
            return action({...data} as TMembership)
        },
        onSuccess: (response: string) => {
            toast({title: "Success", description: response})
            refetch?.()
            setOpen(false)
        },
        onError: (error) => {
            toast({title: "Error while adding membership", description: error.message})
        }
    })

    const onSubmit = (data: TMembershipForm) => {
        mutation.mutate(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={"flex flex-col gap-4 w-full"}>

                <BaseInput label={"Membership Name"} {...form.register("membershipName")}
                           error={form.formState.errors.membershipName?.message} placeholder={"Membership Name"}
                           type={"text"}/>
                <Select onValueChange={(val) => {
                    form.setValue("membershipTier", Number(val))
                }}
                        defaultValue={defaultValues?.membershipTier === undefined ? undefined : defaultValues.membershipTier.toString()} {...form.register("membershipTier")}>
                    <Label>
                        Membership Tier
                    </Label>
                    <SelectTrigger>
                        <SelectValue placeholder={"Select a membership tier"}/>
                    </SelectTrigger>

                    <SelectContent>
                        {[1, 2, 3, 4].map((tier) => {
                            return <SelectItem key={tier} value={tier.toString()}>{tier}</SelectItem>
                        })}
                    </SelectContent>
                </Select>
                <div>
                    <Label className="mb-3">
                        Membership Description
                    </Label>
                    <Textarea {...form.register("membershipBenefits")} className={"resize-none"}/>
                    <p className={"text-red-400 text-sm"}>{form.formState.errors.membershipBenefits?.message}</p>
                </div>

                <BaseInput {...form.register("membershipAmount")} label={"Membership amount"}
                           error={form.formState.errors.membershipAmount?.message}
                           placeholder={"500"} type={"number"}/>

                <Button type={"submit"} disabled={mutation.isPending}>
                    Submit
                </Button>
            </form>
        </Form>
    )
}