import React, { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { fetchDataFromApi } from "@/utils/api";
import Sidebar from "@/components/Dashboard/Sidebar";
import axios from "axios";
import { userData } from "@/utils/helper";

const orders = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [orderData, setOrderData] = useState();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const getListOrder = async () => {
		try {
			const url = "http://localhost:1337/api/orders?populate=*";
			const { user, jwt } = userData();
			if (user && jwt) {
				const config = {
					url,
					headers: { Authorization: `Bearer ${jwt}` },
				};

				const { data } = await axios.get(url, { ...config });
				setOrderData(data.data);
			}
		} catch (err) {
			toast.error(err.message);
		}
	};
	useEffect(() => {
		getListOrder();
	}, []);

	const [showChangeStatus, setShowChangeStatus] = useState();
	const [orderId, setOrderId] = useState();

	const onClickStatus = (id) => {
		setShowChangeStatus(true);
		setOrderId(id);
	};

	const onChangeStatus = async (e) => {
		try {
			const { jwt } = userData();
			const data = {
				data: {
					status: e.target.value,
				},
			};
			setShowChangeStatus(false);
			const url = `http://localhost:1337/api/orders/${orderId}`;
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.put(url, data, config);
			getListOrder();
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<Sidebar>
			<div className="bg-gray-100 min-h-screen">
				<div className="flex justify-between px-4 pt-4">
					<h2>Orders</h2>
					<h2>Welcome Back, Clint</h2>
				</div>
				<div className="p-4">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span>Order</span>
							<span className="sm:text-left text-right">
								Status
							</span>
							<span className="hidden md:grid">Last Order</span>
							<span className="hidden sm:grid">Method</span>
						</div>
						<ul>
							{orderData?.map((item, index) => {
								return (
									<li
										key={item.id}
										className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
									>
										<div className="flex">
											<div className="bg-purple-100 p-3 rounded-lg">
												<FaShoppingBag className="text-purple-800" />
											</div>
											<div className="pl-4">
												<p className="text-gray-800 font-bold">
													$
													{item.attributes.totalPrice}
												</p>
												<p className="text-gray-800 text-sm">
													{item.attributes.user}
												</p>
											</div>
										</div>
										<p className="text-gray-600 sm:text-left text-right flex gap-1 items-center justify-between pr-5">
											<span
											// className={
											//     order.status == "Processing"
											//         ? "bg-green-200 p-2 rounded-lg"
											//         : order.status == "Completed"
											//         ? "bg-blue-200 p-2 rounded-lg"
											//         : "bg-yellow-200 p-2 rounded-lg"
											// }
											>
												{item.attributes.status}
											</span>

											{showChangeStatus &&
											orderId === item.id ? (
												<select
													class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[164px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
													onChange={onChangeStatus}
												>
													<option selected>
														Choose a status
													</option>
													<option value="new">
														New
													</option>
													<option value="delivering">
														Delivering
													</option>
													<option value="paid">
														Paid
													</option>
												</select>
											) : (
												<button
													className="pointer-events-auto rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
													onClick={() =>
														onClickStatus(item.id)
													}
												>
													Change status
												</button>
											)}
										</p>
										<p className="hidden md:flex">
											{String(
												new Date(
													item.attributes.createdAt
												)
											)}
										</p>
										<div className="sm:flex hidden justify-between items-center">
											<p>
												{item.attributes.paymentMethod}
											</p>
											<BsThreeDotsVertical />
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</Sidebar>
	);
};

export default orders;
