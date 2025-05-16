"use client"

import {useState} from "react";
import {ConfirmationDialog} from "@/components/confirmation-dialog/confirmation-dialog";
import {Button} from "@/components/ui/button";
import {handleLogout} from "@/components/action";
import {LogOutIcon} from "lucide-react";


export default function LogoutButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (<div className={"absolute bottom-10 w-[90%]"}>
        <ConfirmationDialog open={isOpen} setOpen={setIsOpen} title={"Log out"}
                            description={"Do you want to log out"} action={handleLogout} actionVariant={"destructive"}
                            actionText={"Log out"}/>
        <Button className={"w-full"} variant={"destructive"} onClick={() => setIsOpen(true)}>
            <LogOutIcon/>
            Log out
        </Button>
    </div>)
}
