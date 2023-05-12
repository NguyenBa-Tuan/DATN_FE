import { formatPound, userData } from "@/utils/helper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { toast } from "react-toastify";

const RecentOrders = () => {
	const [orderData, setOrderData] = useState([]);

	const getListOrder = async () => {
		try {
			const url =
				"http://localhost:1337/api/orders?sort=createdAt:desc&pagination[limit]=5";
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
			toast.error("Đã xảy ra lỗi");
		}
	};
	useEffect(() => {
		getListOrder();
	}, []);
	return (
		<div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
			<h1>Đơn hàng gần đây</h1>
			<ul>
				{orderData.map((item) => {
					const date = new Date(item.attributes.createdAt);
					return (
						<li
							key={item.id}
							className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
						>
							<div className="bg-purple-100 rounded-lg p-3">
								<FaShoppingBag className="text-purple-800" />
							</div>
							<div className="pl-4">
								<p className="text-gray-800 font-bold">
									{formatPound(item.attributes.totalPrice)}{" "}
									VND
								</p>
								<p className="text-gray-400 text-sm">
									{item.attributes.name}
								</p>
							</div>
							<p className="lg:flex md:hidden absolute right-6 text-sm">
								{date.getDate() +
									"/" +
									(date.getMonth() + 1) +
									"/" +
									date.getFullYear()}
							</p>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default RecentOrders;
