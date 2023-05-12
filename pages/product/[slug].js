import React, { useCallback, useEffect, useReducer, useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import Wrapper from "@/components/Wrapper";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel";
import RelatedProducts from "@/components/RelatedProducts";
import { fetchDataFromApi } from "@/utils/api";
import {
	formatPound,
	getDiscountedPricePercentage,
	userData,
} from "@/utils/helper";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateListFavorites } from "@/store/cartSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import axios from "axios";
import _ from "lodash";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import Image from "next/image";
import CommentSection from "@/components/CommentSection";

const ProductDetails = ({ product, products }) => {
	const [selectedSize, setSelectedSize] = useState();
	const [showError, setShowError] = useState(false);
	const [favorite, setFavorite] = useState(false);
	const dispatch = useDispatch();
	const p = product?.data?.[0]?.attributes;
	const router = useRouter();
	const { cartItems } = useSelector((state) => state.cart);
	const [user, setUser] = useState();
	const [jwt, setJwt] = useState();

	const addProductApi = async (dataPayload, userId, jwt) => {
		const url = `http://localhost:1337/api/cards/user/${userId}`;
		const data = {
			...dataPayload,
		};
		const config = {
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		};
		await axios.patch(url, data, config);
	};

	const HandleAddToCart = useCallback(async () => {
		const { user, jwt } = userData();
		const result = cartItems.filter(
			(item) =>
				item.id === product?.data?.[0].id && item.size === selectedSize
		);
		const sizes = p.sizes.filter(
			(item) => item.name === String(selectedSize)
		);
		if (user) {
			if (!selectedSize) {
				setShowError(true);
			} else {
				if (result.length > 0 && result[0]?.count >= sizes[0].stock) {
					toast.error("Số lượng sản phẩm còn lại không đủ");
					return;
				}
				dispatch(
					addToCart({
						...product?.data?.[0],
						size: String(selectedSize),
						oneQuantityPrice: p.price,
					})
				);

				const dataCart = cartItems.filter(
					(item) =>
						product?.data?.[0].id === item.id &&
						selectedSize === item.size
				);
				if (dataCart.length > 0) {
					await addProductApi(
						{
							data: {
								product_id: dataCart[0].id,
								size: dataCart[0].size,
								count: dataCart[0].count + 1,
								oneQuantityPrice: p.price,
							},
						},
						user.id,
						jwt
					);
				} else {
					await addProductApi(
						{
							data: {
								product_id: product?.data?.[0].id,
								size: selectedSize,
								count: 1,
							},
						},
						user.id,
						jwt
					);
				}
			}
		} else {
			router.push("/login");
		}
	}, [dispatch, p.price, product?.data, selectedSize, cartItems]);

	useEffect(() => {
		(async () => {
			const { user, jwt } = userData();
			setJwt(jwt);
			setUser(user);
			if (user?.id) {
				const url = `http://localhost:1337/api/favorite-products?filters[userId]=${user.id}&filters[productId]=${product.data[0].id}`;
				const config = {
					headers: {
						Authorization: `Bearer ${STRAPI_API_TOKEN}`,
					},
				};
				const { data } = await axios.get(url, config);
				if (data.data.length > 0) setFavorite(true);
			}
		})();
	}, []);

	const handleAddToFavorite = () => {
		const { user } = userData();
		if (user?.id === undefined || user?.id === null) {
			router.push("/login");
		} else {
			(async () => {
				const config = {
					headers: {
						Authorization: `Bearer ${STRAPI_API_TOKEN}`,
					},
				};
				const url = `http://localhost:1337/api/favorite-products/put/`;
				const data = {
					userId: user.id,
					productId: product.data[0].id,
				};
				await axios.put(url, data, config);
				setFavorite((prev) => !prev);
				dispatch(updateListFavorites(p.id));
			})();
		}
	};

	return (
		<div className="w-full md:py-20">
			<ToastContainer />
			<Wrapper>
				<div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
					<div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
						{p.image.data ? (
							<ProductDetailsCarousel images={p.image.data} />
						) : (
							p.thumbnail.data.attributes.url && (
								<Image
									width={671}
									height={537}
									src={
										"http://localhost:1337" +
										p.thumbnail.data.attributes.url
									}
									alt={p.thumbnail.data.attributes.url}
								/>
							)
						)}
					</div>

					<div className="flex-[1] py-3">
						<div className="text-[34px] font-semibold mb-2 leading-tight">
							{p.name}
						</div>

						<div className="text-lg font-semibold mb-5">
							{p.subtitle}
						</div>

						<div className="flex items-center">
							<p className="mr-2 text-lg font-semibold">
								MRP : {formatPound(p.price)} VND
							</p>
							{p.original_price && (
								<>
									{p.original_price > p.price && (
										<p className="text-base  font-medium line-through">
											{formatPound(p.original_price)} VND
										</p>
									)}
									<p className="ml-auto text-base font-medium text-green-500">
										Giảm -
										{p.original_price > p.price
											? getDiscountedPricePercentage(
													p.original_price,
													p.price
											  )
											: "0"}
										%
									</p>
								</>
							)}
						</div>

						<div className="text-md font-medium text-black/[0.5]">
							bao gồm thuế
						</div>
						<div className="text-md font-medium text-black/[0.5] mb-20">
							(Cũng bao gồm tất cả các nghĩa vụ áp dụng)
						</div>

						<div className="mb-10">
							<div className="flex justify-between mb-2">
								<div className="text-md font-semibold">
									Lựa chọn size
								</div>
								{/* <div className="text-md font-medium text-black/[0.5] cursor-pointer">
									Select Guide
								</div> */}
							</div>
							<div
								id="sizesGrid"
								className="grid grid-cols-3 gap-2"
							>
								{p.sizes.map((item, i) => (
									<div
										key={i}
										className={`border rounded-md text-center py-3 font-medium ${
											item.stock > 0
												? "hover:border-black cursor-pointer"
												: "cursor-not-allowed bg-black/[0.1] opacity-50"
										} ${
											selectedSize === item.name
												? "border-black"
												: ""
										}`}
										onClick={() => {
											setSelectedSize(item.name);
											setShowError(false);
										}}
									>
										{item.name}
									</div>
								))}
							</div>
							{showError && (
								<div className="text-red-600 mt-1">
									Bạn phải chọn size
								</div>
							)}
						</div>
						<button
							className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75"
							onClick={HandleAddToCart}
						>
							Thêm vào giỏ hàng
						</button>
						<button
							className="w-full py-4 rounded-full border border-black text-lg font-medium transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-75 mb-10"
							onClick={handleAddToFavorite}
						>
							{favorite ? "Hủy yêu thích" : "Yêu thích"}
							<IoMdHeartEmpty
								size={20}
								fill={favorite && "red"}
							/>
						</button>

						<div>
							<div className="text-lg font-bold mb-5">
								Mô tả sản phẩm
							</div>
							<div className="markdown text-md mb-5">
								<ReactMarkdown>{p.description}</ReactMarkdown>
							</div>
						</div>
					</div>
				</div>
				<CommentSection
					pId={product?.data?.[0]?.id}
					user={user}
					jwt={jwt}
				/>
				<RelatedProducts products={products} />
			</Wrapper>
		</div>
	);
};

export default ProductDetails;

export async function getStaticPaths() {
	const products = await fetchDataFromApi("/api/products?populate=*");
	const paths = products?.data?.map((p) => ({
		params: {
			slug: p.attributes.slug || "",
		},
	}));

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params: { slug } }) {
	const product = await fetchDataFromApi(
		`/api/products?populate=*&filters[slug][$eq]=${slug}`
	);
	const products = await fetchDataFromApi(
		`/api/products?populate=*&[filters][slug][$ne]=${slug}`
	);

	return {
		props: {
			product,
			products,
		},
	};
}
