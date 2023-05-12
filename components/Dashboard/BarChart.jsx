import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { userData } from "@/utils/helper";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const BarChart = ({ data }) => {
	const datasetsData = useMemo(() => {
		const dataMap = data.map((item) => item.totalPrice);
		return dataMap;
	}, [data]);
	const dataLabels = useMemo(() => {
		const dataMap = data.map((item) => item.date);
		return dataMap;
	}, [data]);
	const [chartData, setChartData] = useState({
		datasets: [],
	});

	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		setChartData({
			labels: [
				...dataLabels,
				"Mon",
				"Tues",
				"Wed",
				"Thurs",
				"Fri",
				"Sat",
			],
			datasets: [
				{
					label: "Tổng tiền VND",
					data: [
						...datasetsData,
						18127,
						22201,
						19490,
						17938,
						24182,
						17842,
					],
					borderColor: "rgb(53, 162, 235)",
					backgroundColor: "rgb(53, 162, 235, 0.4",
				},
			],
		});
		setChartOptions({
			plugins: {
				legend: {
					position: "top",
				},
				title: {
					display: true,
					text: "Thu nhập hàng tháng",
				},
			},
			maintainAspectRatio: false,
			responsive: true,
		});
	}, [data]);

	return (
		<>
			<div className="w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
				<Bar data={chartData} options={chartOptions} />
			</div>
		</>
	);
};

export default BarChart;
