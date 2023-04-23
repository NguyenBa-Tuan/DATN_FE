import Image from "next/image";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { updateCart, removeFromCart } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import { userData } from "@/utils/helper";
import axios from "axios";
import { toast } from "react-toastify";
const CartItem = ({ data }) => {
	const dataCart = data;
	const p = dataCart.attributes;
	const dispatch = useDispatch();

	const updateProductApi = async (cartItems, userId, jwt) => {
		const url = `http://localhost:1337/api/cards/user/${userId}`;
		const data = {
			data: {
				productData: JSON.stringify(cartItems),
			},
		};
		const config = {
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		};
		await axios.post(url, data, config);
	};

	const updateCartItem = async (e, key) => {
		const { user, jwt } = userData();
		let payload = {
			key,
			val: key === "quantity" ? parseInt(e.target.value) : e.target.value,
			id: dataCart.id,
			selectedSize: data.selectedSize,
		};
		dispatch(updateCart(payload));
	};

	const removeCartApi = async (dataPayload, userId, jwt) => {
		const url = `http://localhost:1337/api/cards/deleteByUser/${userId}`;
		const data = {
			...dataPayload,
		};
		const config = {
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		};
		await axios.put(url, data, config);
	};

	const removeCart = async () => {
		try {
			const { user, jwt } = userData();
			dispatch(
				removeFromCart({
					id: dataCart.id,
					size: dataCart.size,
				})
			);
			await removeCartApi(
				{
					data: {
						product_id: dataCart.id,
						size: dataCart.size,
					},
				},
				user.id,
				jwt
			);
			toast.success("delete successfully");
		} catch (e) {
			toast.error("error deleting");
		}
	};

	return (
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
							<div className="font-semibold">Size:</div>
							<select
								className="hover:text-black"
								onChange={(e) =>
									updateCartItem(e, "selectedSize")
								}
							>
								{p.sizes.map((item, i) => {
									return (
										<option
											key={i}
											value={item.name}
											disabled={
												!item.stock > 0 ? true : false
											}
											selected={data.size === item.name}
										>
											{item.name}
										</option>
									);
								})}
							</select>
						</div>

						<div className="flex items-center gap-1">
							<div className="font-semibold">Số lượng:</div>
							{/* <select
								className="hover:text-black"
								onChange={(e) => updateCartItem(e, "quantity")}
							>
								{p.sizes.map((q, i) => {
									return (
										<option
											key={i}
											value={q.stock}
											selected={data.count === q}
										>
											{q.stock}
										</option>
									);
								})}
							</select> */}
							<input
								type="number"
								defaultValue={data.count || data.quantity}
							/>
						</div>
					</div>
					<RiDeleteBin6Line
						onClick={removeCart}
						className="cursor-pointer text-black/[0.5] hover:text-black text-[16px] md:text-[20px]"
					/>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
