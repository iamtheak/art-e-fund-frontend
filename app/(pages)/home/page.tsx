import {signOut} from "@/auth";
import {redirect} from "next/navigation";

export default async function Page() {

    return (

        <div>
            <h5>Are you sure you want to sign out?</h5>
            <form
                action={async () => {
                    "use server"
                    await signOut({redirectTo: "/login?error=SessionExpired"}).then(() => {
                        redirect("/login?error=SessionExpired");
                    });
                }}
            >
                <button type="submit">Sign out</button>
            </form>
        </div>

    );
}
