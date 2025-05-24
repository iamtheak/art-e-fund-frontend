// app/(pages)/dashboard/page.tsx
import AdminStats from "@/app/(pages)/dashboard/admin-stats";
import AdminUserList from "@/app/(pages)/dashboard/admin-user-list";
import AdminTopEarners from "@/app/(pages)/dashboard/admin-top-earners";
import AdminDailyDonationsChart from "@/app/(pages)/dashboard/admin-daily-donations-chart";

export default async function AdminPage() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Section */}
            <AdminStats />

            {/* User List and Top Earners Section */}
            <section className="grid gap-8 lg:grid-cols-2">
                <AdminUserList />
                <AdminTopEarners />
            </section>

            {/* Donation Chart Section */}
            <AdminDailyDonationsChart />
        </div>
    );
}