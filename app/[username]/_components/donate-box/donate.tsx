// app/[username]/_components/donate-box/donate.tsx
"use client"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {TDonationProps} from "@/app/[username]/_components/donation-dialog/donation-dialog";
import {useMutation} from "@tanstack/react-query";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {toast} from "@/hooks/use-toast";
import {donationSchema, TDonationSchema} from "@/app/[username]/_components/donate-box/validator";
import {submitDonation} from "@/app/[username]/_components/donate-box/action";
import {useSession} from "next-auth/react";

export default function DonateBox({userName, creatorId}: TDonationProps) {
    const [amount, setAmount] = useState<number | "">(5);
    const [message, setMessage] = useState<string>("");
    const session = useSession();

    const [isAnonymous, setIsAnonymous] = useState<boolean>(session.status !== "authenticated");

    const mutation = useMutation({
        mutationFn: async (data: TDonationSchema) => {
            return submitDonation(data);
        },
        onSuccess: () => {
            toast({
                title: "Success!",
                description: `Your donation to ${userName} was successful.`,
                variant: "default",
            });
            setAmount(5);
            setMessage("");
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to process your donation. Please try again.",
                variant: "destructive",
            });
        }
    });

    const handleSubmit = () => {
        try {
            const donationAmount = typeof amount === "number" ? amount : 0;

            const data = donationSchema.parse({
                donationAmount,
                donationMessage: message || undefined,
                creatorId,
                isAnonymous
            });

            mutation.mutate(data);
        } catch (error: any) {
            toast({
                title: "Validation Error",
                description: error.errors?.[0]?.message || "Please check your donation details",
                variant: "destructive",
            });
        }
    };

    return (
        <div className={"p-5 bg-mint rounded-md"}>
            <h2 className={"text-xl mb-2"}>
                Donate to {userName}
            </h2>

            <div className={"w-full flex flex-col gap-5"}>
                <Input
                    type={"number"}
                    value={amount}
                    onChange={(e) => {
                        if (e.target.value === "") {
                            setAmount("");
                            return;
                        }
                        setAmount(parseInt(e.target.value));
                    }}
                    className={"p-2 bg-white rounded-md w-full"}
                    placeholder={"Amount"}
                />

                <Textarea
                    className={"p-2 bg-white rounded-md w-full"}
                    placeholder={"Message"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                {
                    session.data?.user && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="anonymous"
                                checked={isAnonymous}
                                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                            />
                            <Label htmlFor="anonymous">Donate anonymously</Label>
                        </div>)
                }

                <Button
                    className={"bg-yinmn-blue text-white p-2 rounded-md"}
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Processing..." : `Donate ${amount}$`}
                </Button>
            </div>
        </div>
    );
}