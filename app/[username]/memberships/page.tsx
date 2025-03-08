import {getCreatorMemberships} from "@/app/(pages)/view-memberships/@creator/action";
import MembershipProfileCard from "@/app/[username]/memberships/_components/membership-profile-card";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ username: string }>;
}) {
    const slug = (await params).username;
    const data = await getCreatorMemberships(slug);

    return (
        <div className={"p-5 h-[60dvh] bg-emerald rounded-md m-10 flex flex-col gap-4 justify-center items-center"}>
            <h2 className={"text-3xl mb-10"}>Become a member of {slug}</h2>
            <div className={"flex flex-wrap gap-4 overflow-auto justify-center "}>
                {data && data.length > 0 && data.map((membership) => {
                    return (<MembershipProfileCard key={membership.membershipId} membership={membership}/>)
                })}
            </div>
        </div>
    );
}

