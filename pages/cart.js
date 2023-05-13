import React, { useEffect, useMemo, useReducer, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import CartItem from "@/components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { formatPound, userData } from "@/utils/helper";
import { getToCart } from "@/store/cartSlice";
import { v4 as uuidv4 } from "uuid";

const Cart = () => {
	const [loading, setLoading] = useState(false);
	const { cartItems } = useSelector((state) => state.cart);
	const dispatch = useDispatch();
	const [address, setAddress] = useState([]);
	const [showInputAddress, setShowInputAddress] = useReducer(
		(prev) => !prev,
		true
	);
	const router = useRouter();
	const [user, setUser] = useState();

	useEffect(() => {
		(async () => {
			const { user } = userData();
			setUser(user);
			const url = `http://localhost:1337/api/addresses?filters[userId]=${user.id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};
			const { data } = await axios.get(url, config);
			setAddress(data.data);
		})();
	}, [router]);

	const subTotal = useMemo(() => {
		return cartItems.reduce((total, val) => {
			if (val.count) {
				return total + val.attributes.price * val.count;
			} else {
				return total + val.attributes.price * val.quantity;
			}
		}, 0);
	}, [cartItems]);

	const handleSubmit = async (e) => {
		try {
			const orderId = uuidv4();
			setLoading(true);
			const { user, jwt } = userData();
			e.preventDefault();
			const data = {
				data: {
					[e.target.name.name]: e.target.name.value,
					[e.target.email.name]: e.target.email.value,
					[e.target.phone.name]: e.target.phone.value,
					address: e.target.address.value,
					paymentMethod: e.target.paymentMethod.value,
					totalPrice: subTotal,
					listProducts: cartItems,
					status: "new",
					orderId: orderId,
					userId: String(user.id),
				},
			};

			const url = "http://localhost:1337/api/orders";
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.post(url, data, config);
			const urlDeleteCart = `http://localhost:1337/api/cards/deleteByUser/${user.id}`;
			await axios.put(urlDeleteCart, data, config);
			if (showInputAddress) {
				const urlAddress = "http://localhost:1337/api/addresses";
				const dataAddress = {
					data: {
						address: e.target.address.value,
						userId: String(user.id),
					},
				};
				await axios.post(urlAddress, dataAddress, config);
			}
			dispatch(getToCart([]));
			setLoading(false);
			cartItems.map((item) => {
				const data = item.attributes.sizes.map((size) => {
					if (size.name === item.size) {
						return {
							stock: size.stock - item.count,
							sizeId: size.id,
						};
					}
				});
				data.forEach((element) => {
					if (element) {
						const dataSize = {
							data: {
								stock: element.stock,
							},
						};
						axios.put(
							`http://localhost:1337/api/size/${element.sizeId}`,
							dataSize,
							config
						);
					}
				});
			});
			toast.success("Đặt hàng thành công");
			router.push("/success");
		} catch (e) {
			setLoading(false);
			toast.error("Mua hàng lỗi");
			router.push("/failed");
		}
	};

	return (
		<div className="w-full md:py-20">
			<Wrapper>
				{cartItems.length > 0 && (
					<>
						<div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
							<div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
								Giỏ hàng
							</div>
						</div>
						<div className="flex flex-col lg:flex-row gap-12 py-10">
							<div className="flex-[2]">
								<div className="text-lg font-bold">
									Sản phẩm trong giỏ hàng
								</div>
								{cartItems.map((item) => (
									<CartItem
										key={
											Math.floor(Math.random() * 900000) +
											100000
										}
										data={item}
									/>
								))}
							</div>

							<div className="flex-[1]">
								<div className="text-lg font-bold">
									Thanh toán
								</div>

								<div className="p-5 my-5 bg-black/[0.05] rounded-xl">
									<div className="flex justify-between">
										<div className="uppercase text-md md:text-lg font-medium text-black">
											Tổng tiền
										</div>
										<div className="text-md md:text-lg font-medium text-black">
											{formatPound(subTotal)} VND
										</div>
									</div>
									<form
										className="w-full mx-auto max-w-5xl p-0 mt-9"
										onSubmit={handleSubmit}
									>
										<div className="flex flex-wrap -mx-3 mb-6">
											<div className="w-full px-3">
												<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
													Họ tên
												</label>
												<input
													className="appearance-none block w-full bg-zinc-50 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500
                                                    resize-none rounded-lg"
													name="name"
													required
													defaultValue={
														user?.username &&
														user.username
													}
												/>
											</div>
											<div className="w-full px-3">
												<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
													Email
												</label>
												<input
													className="appearance-none block w-full bg-zinc-50 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500
                                                    resize-none rounded-lg"
													name="email"
													required
													type="email"
													defaultValue={
														user?.email &&
														user.email
													}
												/>
											</div>
											<div className="w-full px-3">
												<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
													Số điện thoại
												</label>
												<input
													className="appearance-none block w-full bg-zinc-50 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500
                                                    resize-none rounded-lg"
													name="phone"
													required
													type="phone"
													defaultValue={
														user?.phone &&
														user.phone
													}
												/>
											</div>
											<div className="w-full px-3">
												<div className="flex justify-between items-center">
													<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
														Địa chỉ
													</label>
													{address.length > 0 && (
														<div
															onClick={() =>
																setShowInputAddress()
															}
															className="cursor-pointer"
														>
															{!showInputAddress
																? "nhập địa chỉ"
																: "chọn địa chỉ"}
														</div>
													)}
												</div>
												{address.length > 0 &&
												!showInputAddress ? (
													<div className="mb-3">
														{address.map((item) => {
															return (
																<div className="flex items-center mb-2">
																	<label className="text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center">
																		<input
																			type="radio"
																			value={
																				item
																					.attributes
																					.address
																			}
																			name="address"
																			className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
																		/>
																		{
																			item
																				.attributes
																				.address
																		}
																	</label>
																</div>
															);
														})}
													</div>
												) : (
													<>
														<textarea
															className="appearance-none block w-full bg-zinc-50 text-gray-700 border border-gray-200 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500
                                                    resize-none rounded-lg
                                                    "
															rows="3"
															name="address"
															required
															defaultValue={
																user?.address &&
																user.address
															}
														></textarea>
													</>
												)}
											</div>
											<div className="w-full px-3">
												<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
													Phương thức thanh toán
												</label>
												<div className="flex justify-around items-center">
													<div className="flex items-center">
														<input
															checked
															id="default-radio-2"
															type="radio"
															value="cash"
															name="paymentMethod"
															className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
														/>
														<label
															for="default-radio-2"
															className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
														>
															Tiền mặt
														</label>
													</div>
													<div className="flex items-center">
														<input
															id="default-radio-1"
															type="radio"
															value=""
															name="paymentMethod"
															className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
														/>
														<label
															for="default-radio-1"
															className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
														>
															Bằng thẻ ngân hàng
														</label>
													</div>
												</div>
											</div>
										</div>
										<button className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center">
											Tiếp tục thanh toán
											{loading && (
												<img src="/spinner.svg" />
											)}
										</button>
									</form>
								</div>
							</div>
						</div>
					</>
				)}

				{cartItems.length < 1 && (
					<div className="flex-[2] flex flex-col items-center pb-[50px] md:-mt-14">
						<Image
							alt="/empty-cart.jpg"
							src="/empty-cart.jpg"
							width={300}
							height={300}
							className="w-[300px] md:w-[400px]"
						/>
						<span className="text-xl font-bold">
							Giỏ của bạn đang trống
						</span>
						<span className="text-center mt-4">
							Có vẻ như bạn chưa thêm bất cứ thứ gì vào giỏ hàng
							của mình.
							<br />
							Hãy tiếp tục và khám phá các danh mục hàng đầu.
						</span>
						<Link
							href="/"
							className="py-4 px-8 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 mt-8"
						>
							Tiếp tục mua sắm
						</Link>
					</div>
				)}
			</Wrapper>
		</div>
	);
};

export default Cart;
