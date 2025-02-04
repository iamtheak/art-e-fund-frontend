import {ProfileForm} from "@/app/(pages)/(settings)/profile/profile-form";
import {auth} from "@/auth";
import {TProfileFormValues} from "@/app/(pages)/(settings)/profile/types";

export default async function Page() {

    const session = await auth();

    if (session === null) {
        return null;
    }

    const user: TProfileFormValues = {
        firstName: session.user.firstName ?? "",
        lastName: session.user.lastName ?? "",
        userName: session.user.userName ?? "",
        email: session.user.email ?? "",
        // profilePicture: session.user.profilePicture ?? "",
    };
    return (
        <div>
            <h1>Profile</h1>
            <ProfileForm defaultValues={user}/>

        </div>
    );
}