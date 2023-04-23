import Sidebar from "@/components/Dashboard/Sidebar";
import React, { useEffect, useState } from "react";
import { FaShopify, FaRegEdit, FaRegTrashAlt, FaPlus } from "react-icons/fa";
const maxResult = 10;
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import FormProduct from "@/components/Dashboard/FormProduct";
import Link from "next/link";

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
	return (
		<Sidebar>
			<div className="bg-gray-100 min-h-screen">
				<div className="flex justify-between p-4">
					<h2>Customers</h2>
					<div className="flex gap-[40px]">
						<div className="flex items-center">
							<div className="flex border border-purple-200 rounded">
								<input
									type="text"
									className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
									placeholder="Search..."
								/>
								<button className="px-4 text-white bg-purple-600 border-l rounded ">
									Search
								</button>
							</div>
						</div>
						<Link
							href="/dashboard/addProduct"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							<FaPlus className="inline mr-3" />
							Add
						</Link>
					</div>
				</div>
				<div className="p-4">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span>Name</span>
							<span className="sm:text-left text-right">
								Description
							</span>
							<span className="hidden md:grid">Image</span>
							<span className="hidden sm:grid">Price</span>
							<span className="hidden sm:grid">Action</span>
						</div>
						<ul>
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
											{p.attributes.price}
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
												Edit
											</button>
											<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
												<FaRegTrashAlt className="inline mr-3" />
												Delete
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
