import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaExchangeAlt } from "react-icons/fa";
import { BsThreeDotsVertical, BsFillTrash3Fill } from "react-icons/bs";
import { toast } from "react-toastify";
import Sidebar from "@/components/Dashboard/Sidebar";
import axios from "axios";
import { formatPound, userData } from "@/utils/helper";
import { useRouter } from "next/router";
import { fetchDataFromApi } from "@/utils/api";

const orders = () => {
	const router = useRouter();
	const [orderData, setOrderData] = useState();
	const getListOrder = async () => {
		try {
			const url =
				"http://localhost:1337/api/orders?populate=*&sort[0][createdAt]=desc";
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
			toast.error("Lỗi cập nhật");
		}
	};

	const onChangeFilterOrder = async (e) => {
		try {
			const url = `http://localhost:1337/api/orders?populate=*&sort[0][createdAt]=desc${
				e.target.value !== "" && "&[filters][status]=" + e.target.value
			}`;
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
			toast.error("Lỗi bộ lọc");
		}
	};

	const onDeleteOrder = async (id) => {
		try {
			const { jwt } = userData();
			const url = `http://localhost:1337/api/orders/${id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.delete(url, config);
			getListOrder();
		} catch (err) {
			toast.error("Xóa bị lỗi");
		}
	};

	const onSearch = async (e) => {
		e.preventDefault();
		const url = `/api/orders?populate=*${
			e.target.search.value !== ""
				? "&[filters][$or][0][name][$contains]=" +
				  e.target.search.value +
				  "&[filters][$or][1][orderId][$contains]=" +
				  e.target.search.value
				: ""
		}`;
		const data = await fetchDataFromApi(url);
		setOrderData(data.data);
	};

	return (
		<Sidebar>
			<div className="bg-gray-100 min-h-screen">
				<div className="flex justify-between p-4">
					<h2>Đơn hàng</h2>
					<div className="flex gap-[40px]">
						<div className="flex items-center">
							<div className="flex border border-purple-200 rounded">
								<form onSubmit={onSearch} className="flex">
									<input
										type="text"
										className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
										placeholder="Tìm kiếm..."
										name="search"
									/>
									<button className="px-4 text-white bg-purple-600 border-l rounded w-[150px]">
										Tìm kiếm
									</button>
								</form>
							</div>
						</div>
						{/* <Link
							href="/dashboard/addProduct"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							<FaPlus className="inline mr-3" />
							Thêm mới
						</Link> */}
					</div>
				</div>
				<div className="p-4">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span>Đơn hàng</span>
							<span className="sm:text-left text-right">
								<label className="inline-flex relative items-center pr-5">
									Trạng thái -
									<select
										className="bg-transparent border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:text-white focus:outline-none select-disable-arrow"
										name="filterOrder"
										onChange={onChangeFilterOrder}
									>
										<option selected value="">
											tất cả
										</option>
										<option value="new">Mới</option>
										<option value="delivering">
											Đang giao
										</option>
										<option value="paid">
											Giao hàng thành công
										</option>
										<option value="Refuse">Hủy</option>
									</select>
									<FaExchangeAlt className="absolute right-0" />
								</label>
							</span>
							<span className="hidden md:grid">
								Thời gian tạo
							</span>
							<span className="hidden sm:grid">
								Phương thức thanh toán
							</span>
						</div>
						<ul>
							{orderData?.length === 0 && (
								<li className="bg-gray-50 rounded-lg my-3 p-2 ">
									<p className="text-center">
										Đơn hàng không tồn tại
									</p>
								</li>
							)}
							{orderData?.map((item) => {
								const date = new Date(
									item.attributes.createdAt
								);
								return (
									<li
										key={item.id}
										className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
									>
										<div
											className="flex"
											onClick={() =>
												router.push(
													"/dashboard/order/" +
														item.id
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
														: "Đơn hàng của: " +
														  item?.attributes
																?.name}
												</p>
											</div>
										</div>
										<p
											className={`text-gray-600 sm:text-left text-right flex gap-1 items-center justify-between pr-5 
												${item.attributes.status === "delivering" && "text-yellow-500"}
												${item.attributes.status === "paid" && "text-blue-600"}
												${item.attributes.status === "refuse" && "text-red-600"}
												`}
										>
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

											{showChangeStatus &&
											orderId === item.id ? (
												<select
													class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[164px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
													onChange={onChangeStatus}
												>
													<option selected>
														Thay đổi status
													</option>
													<option value="new">
														Mới
													</option>
													<option value="delivering">
														Đang giao
													</option>
													<option value="paid">
														Giao hàng thành công
													</option>
													{/* <option value="refuse">
														Hủy
													</option> */}
												</select>
											) : (
												item.attributes.status !==
													"refuse" && (
													<button
														className="pointer-events-auto rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"
														onClick={() =>
															onClickStatus(
																item.id
															)
														}
													>
														Thay đổi trạng thái
													</button>
												)
											)}
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
											<div className="flex gap-5">
												<div
													onClick={() =>
														onDeleteOrder(item.id)
													}
												>
													<BsFillTrash3Fill />
												</div>
											</div>
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
