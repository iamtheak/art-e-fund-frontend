"use client"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export default function Donate({username}: { username: string }) {

    const [amount, setAmount] = useState<number | "">(5)
    return (
        <div className={"p-5 bg-mint rounded-md"}>
            <h2 className={"text-xl mb-2"}>
                Donate to {username}
            </h2>

            <div className={"w-full flex flex-col gap-5"}>
                <Input type={"number"} value={amount} onChange={(e) => {

                    if (e.target.value === "") {
                        setAmount("")
                        return
                    }
                    setAmount(parseInt(e.target.value))
                }} className={"p-2 bg-white rounded-md w-full"} placeholder={"Amount"}/>

                <Textarea className={"p-2 bg-white rounded-md w-full"} placeholder={"Message"}/>
                <Button className={"bg-yinmn-blue text-white p-2 rounded-md"}>
                    Donate {amount}$
                </Button>
            </div>
        </div>
    )
}