// app/donation-success/page.tsx
import {Metadata} from "next";
import {verifyDonation} from "@/app/donation-success/action";
import {getCreatorById} from "@/app/(pages)/view-memberships/action";
import {redirect} from "next/navigation";
import FailedDonation from "@/app/donation-success/failed-donation";
import {decodeUrl} from "@/global/helper";

// Define types for search params
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
    creatorId: number;
}

export const metadata: Metadata = {
    title: "Donation Success",
    description: "Thank you for your donation!",
};

export default async function DonationSuccess({
                                                  searchParams,
                                              }: {
    searchParams: SearchParams; // Fix: removed Promise wrapper
}) {
    // Get the payment ID directly - no await needed
    const paymentId = searchParams.pidx;


    if (!paymentId) {
        return (<FailedDonation/>)
    }

    // Parse the purchase order data
    let purchaseData: PurchaseOrderData | null = null;

    if (searchParams.purchase_order_id) {
        purchaseData = decodeUrl(searchParams.purchase_order_id);

        if (!purchaseData) {
            return (<FailedDonation/>)
        }
    }

    let purchaseOrderName;
    if (searchParams.purchase_order_name) {
        try {
            purchaseOrderName = decodeURIComponent(searchParams.purchase_order_name);
        } catch (error) {


            console.error("Failed to parse purchase order name:", error);
        }
    }

    const verify = await verifyDonation(
        paymentId ?? "",
        purchaseData?.creatorId ?? 0,
        purchaseData?.userId ?? 0,
        purchaseOrderName ?? ""
    );


    if (verify === null) {
        redirect("/home")
    }
    const creator = await getCreatorById(verify?.creatorId);

    if (creator === null || creator.creatorId === undefined || creator.creatorId === null || creator.userName === undefined || creator.userName === null) {
        redirect("/home")
    }

    if (creator) {
        redirect(`/${creator.userName}?message=donation-success`);
    } else {
        redirect(`/home`);
    }

    // This line should never be reached
    return null;
}