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
import Loader from "@/components/loader";
import {useRouter} from "next/navigation";

export default function DonateBox({userName, creatorId}: TDonationProps) {
    const [amount, setAmount] = useState<number | "">(5);
    const [message, setMessage] = useState<string>("");
    const session = useSession();

    const [isAnonymous, setIsAnonymous] = useState<boolean>(session.status !== "authenticated");

    const router = useRouter();
    const mutation = useMutation({
        mutationFn: async (data: TDonationSchema) => {
            return submitDonation(data);
        },
        onSuccess: async (data) => {


            if (!data.success) {
                return toast({
                        title: "Error",
                        description: data.message,
                        variant: "destructive",
                    }
                )
            }

            toast({
                title: "Success!",
                description: `Your donation has been verified and is being processed.`,
                variant: "default",
            });

            if (data.payment_url !== null && data.payment_url !== undefined) {
                router.push(data.payment_url);
            }
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to process your donation. Please try again.",
                variant: "destructive",
            });
        }
    });

    const handleSubmit = async () => {
        try {
            const donationAmount = typeof amount === "number" ? amount : 0;

            const data = donationSchema.parse({
                donationAmount,
                donationMessage: message || undefined,
                creatorId,
                isAnonymous
            });

            await mutation.mutateAsync(data);
        } catch (error: any) {
            toast({
                title: "Validation Error",
                description: error.errors?.[0]?.message || "Please check your donation details",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            {
                mutation.isPending && <Loader text="You will be redirected to khalti payment page"/>
            }
            {/* Assuming 'bg-mint' is a brand color and should remain consistent */}
            <div className={"p-5 dark:text-white dark:bg-slate-900 rounded-md relative shadow-lg"}>

                {/* Updated text color for dark mode compatibility on mint background */}
                <h2 className={"text-xl mb-2 text-slate-800 dark:text-slate-100"}>
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
                        // Updated background for theme compatibility
                        className={"p-2 bg-background rounded-md w-full"}
                        placeholder={"Amount"}
                    />

                    <Textarea
                        // Updated background for theme compatibility
                        className={"p-2 bg-background rounded-md w-full"}
                        placeholder={"Message"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    {
                        session.data?.user && (
                            // Label component should be theme-aware by default
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
                        // Assuming 'bg-yinmn-blue text-white' is a brand color combination
                        className={"bg-yinmn-blue text-white p-2 rounded-md"}
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Processing..." : `Donate ${amount} Rs via Khalti`}
                    </Button>
                </div>
            </div>
        </>
    );
}