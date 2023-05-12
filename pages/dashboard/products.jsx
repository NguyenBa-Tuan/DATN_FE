import Sidebar from "@/components/Dashboard/Sidebar";
import React, { useEffect, useState } from "react";
import { FaShopify, FaRegEdit, FaRegTrashAlt, FaPlus } from "react-icons/fa";
const maxResult = 10;
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";
import { formatPound } from "@/utils/helper";

const products = () => {
	const [productsData, setProductData] = useState();
	const [pageIndex, setPageIndex] = useState(1);
	const router = useRouter();
	const getListProducts = async () => {
		const url = `/api/products?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`;
		const data = await fetchDataFromApi(url);
		setProductData(data);
	};
	useEffect(() => {
		getListProducts();
	}, [pageIndex]);
	useEffect(() => {
		setPageIndex(1);
	}, [router]);

	// fix Hydration
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) {
		return null;
	}

	const onSearch = async (e) => {
		e.preventDefault();
		const url = `/api/products?populate=*${
			e.target.search.value !== ""
				? "&[filters][name][$contains]=" + e.target.search.value
				: ""
		}&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`;
		const data = await fetchDataFromApi(url);
		setProductData(data);
	};

	const onDelete = async (id) => {
		try {
			const url = `http://localhost:1337/api/products/${id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};
			await axios.delete(url, config);
			getListProducts();
		} catch (e) {}
	};
	return (
		<Sidebar>
			<div className="bg-gray-100 min-h-screen">
				<div className="flex justify-between p-4">
					<h2>Sản phẩm</h2>
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
						<Link
							href="/dashboard/addProduct"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							<FaPlus className="inline mr-3" />
							Thêm mới
						</Link>
					</div>
				</div>
				<div className="p-4">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span>Tên</span>
							<span className="sm:text-left text-right">
								Mô tả
							</span>
							<span className="hidden md:grid">Hình ảnh</span>
							<span className="hidden sm:grid">Giá</span>
							<span className="hidden sm:grid">Xử lý</span>
						</div>
						<ul>
							{productsData?.data.length === 0 && (
								<li className="bg-gray-50 rounded-lg my-3 p-2 ">
									<p className="text-center">
										Sản phẩm không tồn tại
									</p>
								</li>
							)}
							{productsData?.data?.map((p) => {
								return (
									<li
										key={p.id}
										className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
									>
										<div className="flex items-center">
											<div className="bg-purple-100 p-3 rounded-lg">
												<FaShopify className="text-purple-800" />
											</div>
											<p className="pl-4">
												{p.attributes.name}
											</p>
										</div>
										<p className="text-gray-600 sm:text-left text-right">
											<p>{p.attributes.description}</p>
										</p>
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
												class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
												onClick={() =>
													router.push(
														`editProduct/${p.id}`
													)
												}
											>
												<FaRegEdit className="inline mr-3" />
												Chỉnh sửa
											</button>
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
						{productsData?.meta?.pagination?.total > maxResult && (
							<div className="flex gap-3 items-center justify-center my-16 md:my-0">
								<button
									className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
									disabled={pageIndex === 1}
									onClick={() => setPageIndex(pageIndex - 1)}
								>
									Previous
								</button>

								<span className="font-bold">{`${pageIndex} of ${
									productsData &&
									productsData.meta.pagination.pageCount
								}`}</span>

								<button
									className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
									disabled={
										pageIndex ===
										(productsData &&
											productsData.meta.pagination
												.pageCount)
									}
									onClick={() => setPageIndex(pageIndex + 1)}
								>
									Next
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</Sidebar>
	);
};

export default products;
