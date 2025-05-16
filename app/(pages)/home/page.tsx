import HomeHeader from "@/app/(pages)/home/_components/home-header";
import DonationChart from "@/app/(pages)/home/_components/donation-chart";
import TopDonators from "@/app/(pages)/home/_components/top-donators"; // Import Donator type
import DonationSourcePieChart from "@/app/(pages)/home/_components/donation-source-pie-chart";
import NewMembers from "@/app/(pages)/home/_components/new-members";
import {getDailyDonations, getDonationSources, getTopDonators} from "@/app/(pages)/home/action";


export default async function Page() {
    // Fetch data server-side
    const topDonatorsData = await getTopDonators();
    const chartData = await getDailyDonations()
    const donationSourceData = await getDonationSources();

    return (
        <div className="p-4 space-y-4">
            <HomeHeader/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Donation Chart takes more space */}
                <div className="lg:col-span-2">
                    <DonationChart allChartData={chartData}/>
                </div>

                <div>
                    <DonationSourcePieChart donationSourceData={donationSourceData}/>
                </div>
                <TopDonators donators={topDonatorsData}/>
            </div>
            <NewMembers/>
        </div>
    );
}