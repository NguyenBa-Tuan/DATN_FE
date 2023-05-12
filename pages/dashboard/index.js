import BarChart from "@/components/Dashboard/BarChart";
import Header from "@/components/Dashboard/Header";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import Sidebar from "@/components/Dashboard/Sidebar";
import TopCards from "@/components/Dashboard/TopCards";
import { userData } from "@/utils/helper";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
	const router = useRouter();
	const [BarChartData, setBarChartData] = useState([]);
	const [currentDateData, setCurrentDateData] = useState({});

	useEffect(() => {
		const { user } = userData();
		if (user === undefined || user?.userRole !== "admin") router.push("/");
		(async () => {
			const url = `http://localhost:1337/api/order/getByDate`;
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};
			const { data } = await axios.get(url, config);
			const currentDate = await axios.get(
				"http://localhost:1337/api/order/getByCurrentDate",
				config
			);

			setCurrentDateData(currentDate.data[0]);
			setBarChartData(data[0]);
		})();
	}, []);
	return (
		<Sidebar>
			<main className="bg-gray-100 min-h-screen">
				<Header />
				<TopCards data={currentDateData} />
				<div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
					<BarChart data={BarChartData} />
					<RecentOrders />
				</div>
			</main>
		</Sidebar>
	);
};

export default Dashboard;
