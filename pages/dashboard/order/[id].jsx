import Sidebar from "@/components/Dashboard/Sidebar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userData } from "@/utils/helper";
import axios from "axios";
import Image from "next/image";

const OrderDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [orderData, setOrderData] = useState();
	const getOrder = async () => {
		try {
			if (id) {
				const url = `http://localhost:1337/api/orders/${id}`;
				const { user, jwt } = userData();
				if (user && jwt) {
					const config = {
						url,
						headers: { Authorization: `Bearer ${jwt}` },
					};

					const { data } = await axios.get(url, { ...config });
					setOrderData(data.data);
				}
			}
		} catch (err) {
			toast.error("Đã xảy ra lỗi");
		}
	};
	useEffect(() => {
		getOrder();
	}, [router]);
	return (
		<Sidebar>
			<div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
				<div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
					<span className="normal-case">
						{orderData?.attributes?.orderId
							? "Mã đơn hàng:" + orderData?.attributes?.orderId
							: "Đơn hàng của: " + orderData?.attributes?.name}
					</span>
				</div>
			</div>

			{orderData?.attributes?.listProducts?.map((item) => {
				const p = item.attributes;
				return (
					<div className="flex flex-col lg:flex-row gap-12 p-10 min-h-[80vh]">
						<div className="flex-[2]">
							<div className="flex py-5 gap-3 md:gap-5 border-b">
								<div className="shrink-0 aspect-square w-[50px] md:w-[120px]">
									<Image
										src={
											"http://localhost:1337" +
											p.thumbnail.data.attributes.url
										}
										alt={p.name}
										width={120}
										height={120}
									/>
								</div>

								<div className="w-full flex flex-col">
									<div className="flex flex-col md:flex-row justify-between">
										<div className="text-lg md:text-2xl font-semibold text-black/[0.8]">
											{p.name}
										</div>

										<div className="text-sm md:text-md font-medium text-black/[0.5] block md:hidden">
											{p.subtitle}
										</div>

										<div className="text-sm md:text-md font-bold text-black/[0.5] mt-2">
											MRP : {p.price} VND
										</div>
									</div>

									<div className="text-md font-medium text-black/[0.5] hidden md:block">
										{p.subtitle}
									</div>

									<div className="flex items-center justify-between mt-4">
										<div className="flex items-center gap-2 md:gap-10 text-black/[0.5] text-sm md:text-md">
											<div className="flex items-center gap-1">
												<div className="font-semibold">
													Size: {item?.size}
												</div>
											</div>

											<div className="flex items-center gap-1">
												<div className="font-semibold">
													Số lượng: {item?.count}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex-[1]">
							<div className="p-5 my-5 bg-black/[0.05] rounded-xl">
								<div className="flex justify-between">
									<div className="uppercase text-md md:text-lg font-medium text-black">
										Tổng tiền
									</div>
									<div className="text-md md:text-lg font-medium text-black">
										{orderData?.attributes?.totalPrice} VND
									</div>
								</div>
								<div className="w-full mx-auto max-w-5xl p-0 mt-4">
									<div className="flex flex-wrap -mx-3">
										<div className="w-full px-3">
											<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
												Họ tên:{" "}
												<span className="normal-case">
													{
														orderData?.attributes
															?.name
													}
												</span>
											</label>
										</div>
										<div className="w-full px-3">
											<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
												Email:{" "}
												<span className="normal-case">
													{
														orderData?.attributes
															?.email
													}
												</span>
											</label>
										</div>
										<div className="w-full px-3">
											<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
												Số điện thoại:{" "}
												<span className="normal-case">
													{
														orderData?.attributes
															?.phone
													}
												</span>
											</label>
										</div>
										<div className="w-full px-3">
											<div className="flex justify-between items-center">
												<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
													Địa chỉ:{" "}
													<span className="normal-case">
														{
															orderData
																?.attributes
																?.address
														}
													</span>
												</label>
											</div>
										</div>
										<div className="w-full px-3">
											<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
												Phương thức thanh toán:{" "}
												<span className="normal-case">
													{orderData?.attributes
														?.paymentMethod ===
													"cash"
														? "Tiền mặt"
														: "Thẻ"}
												</span>
											</label>
										</div>
										<div className="w-full px-3">
											<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
												Trạng thái đơn hàng:{" "}
												<span className="normal-case">
													{orderData?.attributes
														?.status === "new" &&
														"Mới"}
													{orderData?.attributes
														?.status ===
														"delivering" &&
														"Đang giao"}
													{orderData?.attributes
														?.status === "paid" &&
														"Thành công"}
													{orderData?.attributes
														?.status === "refuse" &&
														"Hủy"}
													{!orderData?.attributes
														?.status && "Mới"}
												</span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</Sidebar>
	);
};

export default OrderDetail;
