import BarChart from "@/components/Dashboard/BarChart";
import Header from "@/components/Dashboard/Header";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import Sidebar from "@/components/Dashboard/Sidebar";
import TopCards from "@/components/Dashboard/TopCards";
import { userData } from "@/utils/helper";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Dashboard = () => {
	const router = useRouter();

	useEffect(() => {
		const { user } = userData();
		if (user === undefined || user?.userRole !== "admin") router.push("/");
	});
	return (
		<Sidebar>
			<main className="bg-gray-100 min-h-screen">
				<Header />
				<TopCards />
				<div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
					<BarChart />
					<RecentOrders />
				</div>
			</main>
		</Sidebar>
	);
};

export default Dashboard;
