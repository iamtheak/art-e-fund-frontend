import {Metadata} from "next";
import {verifyMembership} from "@/app/membership-success/action";
import {redirect} from "next/navigation";
import FailedMembership from "@/app/membership-success/failed-membership";
import {decodeUrl} from "@/global/helper";

type SearchParams = {
    pidx?: string;
    transaction_id?: string;
    amount?: string;
    purchase_order_id?: string;
    purchase_order_name?: string;
    status?: string;
};

interface PurchaseOrderData {
    userId: number;
    membershipId: number;
    membershipType: "New" | "Upgrade";
}

export const metadata: Metadata = {
    title: "Membership Success",
    description: "Thank you for your membership purchase!",
};

export default async function MembershipSuccess({
                                                    searchParams,
                                                }: {
    searchParams: SearchParams;
}) {
    const paymentId = searchParams.pidx;

    if (!paymentId) {
        return (<FailedMembership/>)
    }

    // Parse the purchase order data
    let purchaseData: PurchaseOrderData | null = null;

    if (searchParams.purchase_order_id) {
        purchaseData = decodeUrl(searchParams.purchase_order_id);

        if (!purchaseData) {
            return (<FailedMembership/>)
        }
    }

    const verify = await verifyMembership(
            paymentId ?? "",
            purchaseData?.membershipId ?? 0,
            purchaseData?.userId ?? 0,
            purchaseData?.membershipType === "New" ? 0 : 1
        )
    ;

    if (verify === null) {
        redirect("/home")
    }

    redirect("/view-memberships");


    return null;
}