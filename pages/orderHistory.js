import Wrapper from "@/components/Wrapper";
import { fetchDataFromApi } from "@/utils/api";
import { formatPound, userData } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const maxResult = 10;
import { FaShoppingBag } from "react-icons/fa";

function orderHistory() {
	const [pageIndex, setPageIndex] = useState(1);
	const router = useRouter();
	const [orderData, setOrderData] = useState();

	const getListOrder = async () => {
		const { user } = userData();
		const url = `/api/orders?populate=*&[filters][userId]=${user.id}&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`;
		const data = await fetchDataFromApi(url);
		setOrderData(data.data);
	};

	useEffect(() => {
		getListOrder();
	}, []);

	useEffect(() => {
		setPageIndex(1);
	}, [router]);

	const onChangeStatus = async (id) => {
		try {
			const { jwt } = userData();
			const data = {
				data: {
					status: "refuse",
				},
			};
			const url = `http://localhost:1337/api/orders/${id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.put(url, data, config);
			getListOrder();
		} catch (err) {
			toast.error("Đã xảy ra lỗi");
		}
	};

	return (
		<Wrapper className="min-h-screen">
			<div className="text-center max-w-[800px] mx-auto my-[40px] md:my-[40px] ">
				<h1 className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
					Lịch sử mua hàng
				</h1>
			</div>

			<div className="flex w-full">
				<div className="p-4 w-full">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span className="col-span-2">Đơn hàng</span>
							<span className="sm:text-left text-right">
								Trạng thái
							</span>
							<span className="hidden md:grid">
								Thời gian tạo
							</span>
							<span className="hidden sm:grid">
								Phương thức thanh toán
							</span>
							<span className="text-right">Xử lý</span>
						</div>
						<ul>
							{orderData?.length === 0 && (
								<div className="flex flex-col lg:flex-row gap-12 p-10 text-center justify-center">
									Bạn chưa từng mua hàng tại website
								</div>
							)}
							{orderData?.map((item) => {
								const date = new Date(
									item.attributes.createdAt
								);
								return (
									<li
										key={item.id}
										className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
									>
										<div
											className="flex col-span-2"
											onClick={() =>
												router.push(
													"/orderHistory/" + item.id
												)
											}
										>
											<div className="bg-purple-100 p-3 rounded-lg">
												<FaShoppingBag className="text-purple-800" />
											</div>
											<div className="pl-4">
												<p className="text-gray-800 font-bold">
													{formatPound(
														item.attributes
															.totalPrice
													)}{" "}
													VND
												</p>
												<p className="text-gray-800 text-sm">
													{item?.attributes?.orderId
														? "Mã đơn hàng:" +
														  item?.attributes
																?.orderId
														: "Tên đơn hàng: " +
														  item?.attributes
																?.name}
												</p>
											</div>
										</div>
										<p className="text-gray-600 sm:text-left text-right flex gap-1 items-center justify-between pr-5">
											<span>
												{item.attributes.status ===
													"new" && "Mới"}
												{item.attributes.status ===
													"delivering" && "Đang giao"}
												{item.attributes.status ===
													"paid" && "Thành công"}
												{item.attributes.status ===
													"refuse" && "Hủy"}
												{!item.attributes.status &&
													"Mới"}
											</span>
										</p>
										<p className="hidden md:flex">
											{date.getDate() +
												"/" +
												(date.getMonth() + 1) +
												"/" +
												date.getFullYear()}
										</p>
										<div className="sm:flex hidden justify-between items-center">
											<p>
												{item.attributes
													.paymentMethod === "cash"
													? "Tiền mặt"
													: "Thẻ"}
											</p>
										</div>
										<div className="sm:flex hidden justify-end items-center w-full text-red-600 font-bold">
											<button
												onClick={() =>
													onChangeStatus(item.id)
												}
											>
												{item.attributes.status ===
													"new" && "Hủy đơn hàng"}
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</Wrapper>
	);
}

export default orderHistory;
