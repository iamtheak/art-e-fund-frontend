import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";

export default function NewUser() {

    const onContinue = async () => {
        redirect("/home");
    }
    const onBecomeCreator = async () => {
        redirect("/new-creator");
    }
    return (
        <div>
            <h1>New User</h1>
            <p>Here you can create a new user account.</p>
            <Button onClick={onContinue}>Sign Up</Button>
            <Button onClick={onBecomeCreator}>Become a creator</Button>
        </div>
    );
}