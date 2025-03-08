"use client"
import BaseDialog from "@/components/base-dialog/base-dialog";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import DonateBox from "@/app/[username]/_components/donate-box/donate";

export type TDonationProps = {
    userName: string;
    creatorId: number;
}
export default function DonationDialog({
                                           userName,
                                           creatorId
                                       }:
                                       TDonationProps
) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button onClick={() => {
                setIsOpen(true)
            }}>
                Donate
            </Button>
            <BaseDialog title={"Donate the amount you like"} isOpen={isOpen} setIsOpen={setIsOpen}>
                <div>
                    <DonateBox userName={userName} creatorId={creatorId}/>
                </div>
            </BaseDialog>
        </>
    );
}