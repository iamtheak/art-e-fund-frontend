import {auth} from "@/auth";

export const getUserFromSession = async ()=>{
    const session = await auth();

    return session?.user || null;
}
