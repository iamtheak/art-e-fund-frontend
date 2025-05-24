import {getCreatorMemberships} from "@/app/(pages)/view-memberships/@creator/action";
import MembershipProfileCard from "@/app/[username]/memberships/_components/membership-profile-card";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ username: string }>;
}) {
    const slug = (await params).username;
    const data = await getCreatorMemberships(slug);

    const sortedData = data?.sort((a, b) => {
        return a.membershipTier > b.membershipTier ? 1 : -1;
    })

    return (
        <div
            className={"p-5 min-h-[60dvh] w-full bg-[#FAFAFA] dark:bg-slate-900 rounded-md m-10 flex flex-col gap-4 justify-center items-center"}>
            <h2 className={"text-3xl mb-10"}>Become a member of {slug}</h2>
            <div className={"flex gap-4 justify-center flex-wrap"}>
                {sortedData && sortedData.length > 0 && sortedData.map((membership) => {
                    return (<MembershipProfileCard key={membership.membershipId} membership={membership}/>)
                })}
            </div>
        </div>
    );
}

