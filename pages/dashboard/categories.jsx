import Sidebar from "@/components/Dashboard/Sidebar";
import React, { useEffect, useReducer, useState } from "react";
import { FaShopify, FaRegEdit, FaRegTrashAlt, FaPlus } from "react-icons/fa";
const maxResult = 10;
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "react-modal";
import axios from "axios";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import { toast } from "react-toastify";

const customStyles = {
	overlay: {
		background: "rgba(219, 223, 229, 0.9)",
	},
	content: {
		left: "50%",
		right: "auto",
		bottom: "auto",
		borderRadius: 6,
		padding: 0,
		border: 0,
		marginRight: "-50%",
		maxWidth: 800,
		width: "100%",
		backgroundColor: "transparent",
		transform: "translate(-50%, -50%)",
		top: "50%",
	},
};

const categories = () => {
	const [categoriesData, setCategoriesData] = useState();
	const [pageIndex, setPageIndex] = useState(1);
	const [showModel, setShowModel] = useReducer((prev) => !prev, false);
	const router = useRouter();
	const getListCategories = async () => {
		const url = `/api/categories?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`;
		const data = await fetchDataFromApi(url);
		setCategoriesData(data);
	};
	useEffect(() => {
		getListCategories();
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
		const url = `/api/categories?populate=*${
			e.target.search.value !== ""
				? "&[filters][name][$contains]=" + e.target.search.value
				: ""
		}&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`;
		const data = await fetchDataFromApi(url);
		setCategoriesData(data);
	};

	const config = {
		headers: {
			Authorization: `Bearer ${STRAPI_API_TOKEN}`,
		},
	};
	const onSubmitAdd = async (e) => {
		try {
			e.preventDefault();
			const url = `http://localhost:1337/api/categories`;
			const data = {
				data: {
					name: e.target.name.value,
				},
			};
			await axios.post(url, data, config);
			getListCategories();
			setShowModel();
		} catch (err) {
			toast.error("Lỗi thêm danh mục. Vui lòng thử lại!");
		}
	};
	const onSubmitUpdate = async (e) => {
		try {
			e.preventDefault();
			const url = `http://localhost:1337/api/categories/${e.target.id.value}`;
			const data = {
				data: {
					name: e.target.name.value,
				},
			};
			await axios.put(url, data, config);
			getListCategories();
			e.target.reset();
		} catch (err) {
			toast.error("Cập nhật danh mục. Vui lòng thử lại!");
		}
	};

	const onDelete = async (e) => {
		try {
			e.preventDefault();
			const url = `http://localhost:1337/api/categories/${e.target.id.value}`;
			await axios.delete(url, config);
			getListCategories();
		} catch (err) {
			toast.error("Xóa danh mục. Vui lòng thử lại!");
		}
	};

	return (
		<>
			<Modal
				isOpen={showModel}
				style={customStyles}
				onRequestClose={setShowModel}
			>
				<form onSubmit={onSubmitAdd} className="flex">
					<input
						type="text"
						className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
						placeholder="Tên danh mục..."
						name="name"
					/>
					<button className="px-4 text-white bg-purple-600 border-l rounded w-[150px]">
						Thêm mới
					</button>
				</form>
			</Modal>
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
							<button
								onClick={setShowModel}
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							>
								<FaPlus className="inline mr-3" />
								Thêm mới
							</button>
						</div>
					</div>
					<div className="p-4">
						<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
							<div className="my-3 p-2 grid md:grid-cols-2 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
								<span>Tên</span>
								<span className="hidden sm:grid">
									Hành động
								</span>
							</div>
							<ul>
								{categoriesData?.data.length === 0 && (
									<li className="bg-gray-50 rounded-lg my-3 p-2 ">
										<p className="text-center">
											Danh mục không tồn tại
										</p>
									</li>
								)}
								{categoriesData?.data?.map((p) => {
									return (
										<li
											key={p.id}
											className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-2 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
										>
											<div className="flex items-center">
												<div className="bg-purple-100 p-3 rounded-lg">
													<FaShopify className="text-purple-800" />
												</div>
												<p className="pl-4">
													{p.attributes.name}
												</p>
											</div>

											<div className="sm:flex hidden items-center gap-[40px]">
												<form
													className="flex"
													onSubmit={onSubmitUpdate}
												>
													<input
														type="text"
														className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
														placeholder="Tên danh mục..."
														name="name"
													/>
													<input
														type="text"
														className="hidden"
														name="id"
														value={p.id}
													/>

													<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[131px]">
														<FaRegEdit className="inline mr-3" />
														Chỉnh sửa
													</button>
												</form>
												<form
													className="flex"
													onSubmit={onDelete}
												>
													<input
														type="text"
														className="hidden"
														name="id"
														value={p.id}
													/>

													<button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
														<FaRegTrashAlt className="inline mr-3" />
														Xóa
													</button>
												</form>
											</div>
										</li>
									);
								})}
							</ul>
							{categoriesData?.meta?.pagination?.total >
								maxResult && (
								<div className="flex gap-3 items-center justify-center my-16 md:my-0">
									<button
										className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
										disabled={pageIndex === 1}
										onClick={() =>
											setPageIndex(pageIndex - 1)
										}
									>
										Previous
									</button>

									<span className="font-bold">{`${pageIndex} of ${
										categoriesData &&
										categoriesData.meta.pagination.pageCount
									}`}</span>

									<button
										className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
										disabled={
											pageIndex ===
											(categoriesData &&
												categoriesData.meta.pagination
													.pageCount)
										}
										onClick={() =>
											setPageIndex(pageIndex + 1)
										}
									>
										Next
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</Sidebar>
		</>
	);
};

export default categories;
