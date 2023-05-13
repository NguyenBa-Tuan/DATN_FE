import Wrapper from "@/components/Wrapper";
import { formatPound, userData } from "@/utils/helper";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FaRegTrashAlt, FaShopify } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import _ from "lodash";
import Image from "next/image";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import { updateListFavorites } from "@/store/cartSlice";

const favorite = () => {
	const dispatch = useDispatch();

	const { listFavorite } = useSelector((state) => state.cart);
	const [listProducts, setListProducts] = useState([]);

	const listProductsId = useMemo(() => {
		let data = [];
		data = listFavorite.map((item) => {
			return item.attributes.productId;
		});
		return data;
	}, [listFavorite]);

	const getListProducts = async () => {
		try {
			const url = `http://localhost:1337/api/products?populate=*&pagination[pageSize]=100`;
			const { data } = await axios.get(url);
			let listPrd = [];
			data?.data.map((item) => {
				if (_.includes(listProductsId, String(item.id))) {
					listPrd.push(item);
				}
			});
			setListProducts(listPrd);
		} catch (err) {
			toast.error("Đã xảy ra lỗi");
		}
	};

	useEffect(() => {
		getListProducts();
	}, [listFavorite, listProducts]);

	const onDelete = async (id) => {
		try {
			const { user } = userData();
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};
			const url = `http://localhost:1337/api/favorite-products/put/`;
			const data = {
				userId: user.id,
				productId: id,
			};
			await axios.put(url, data, config);
			dispatch(updateListFavorites(String(id)));
			getListProducts();
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Wrapper>
			<div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
				<div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
					<div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
						Sản phẩm yêu thích
					</div>
				</div>
				<div className="p-4">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span>Tên</span>
							<span className="hidden md:grid">Hình ảnh</span>
							<span className="hidden sm:grid">Giá</span>
							<span className="hidden sm:grid">Xử lý</span>
						</div>
						<ul>
							{listFavorite?.length === 0 && (
								<li className="bg-gray-50 rounded-lg my-3 p-2 ">
									<p className="text-center">
										Không có sản phẩm nào bạn yêu thích
									</p>
								</li>
							)}
							{listProducts?.map((p) => {
								return (
									<li
										key={p.id}
										className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
									>
										<Link
											href={`/product/${p.attributes.slug}`}
										>
											<div className="flex items-center">
												<div className="bg-purple-100 p-3 rounded-lg">
													<FaShopify className="text-purple-800" />
												</div>
												<p className="pl-4">
													{p.attributes.name}
												</p>
											</div>
										</Link>
										<p className="hidden md:flex">
											<Image
												src={
													p.attributes.thumbnail.data
														? "http://localhost:1337" +
														  p.attributes.thumbnail
																.data.attributes
																.url
														: "/no-image.jpg"
												}
												width={300}
												height={300}
												className="mx-auto"
											/>
										</p>
										<div className="sm:flex hidden justify-between items-center">
											{formatPound(p.attributes.price)}{" "}
											VND
										</div>
										<div className="sm:flex hidden items-center gap-[40px]">
											<button
												class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
												onClick={() => onDelete(p.id)}
											>
												<FaRegTrashAlt className="inline mr-3" />
												Xóa
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
};

export default favorite;
