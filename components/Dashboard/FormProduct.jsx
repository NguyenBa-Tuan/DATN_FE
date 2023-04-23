import React, { useEffect, useState } from "react";
import { FaPlus, FaRegWindowClose, FaFileImage } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { fetchDataFromApi } from "@/utils/api";

const FormProduct = ({ dataProduct, onSubmit }) => {
	const [categories, setCategories] = useState();
	const fetchCategories = async () => {
		const { data } = await fetchDataFromApi("/api/categories?populate=*");
		setCategories(data);
	};
	const [size, setSize] = useState({ name: "", stock: 0 });
	const [listSize, setListSize] = useState([]);
	const onChangeSize = (e) => {
		if (e.target.name === "sizeName") {
			setSize({ ...size, name: e.target.value });
		}
		if (e.target.name === "stock") {
			setSize({ ...size, stock: Number(e.target.value) });
		}
	};
	const onClickAddSize = () => {
		if (
			listSize.filter((d) => d.name === size.name).length === 0 &&
			size.name !== "" &&
			size.stock !== ""
		) {
			let data = [...listSize];
			data = [...data, size];
			setListSize(data);
			setSize({ name: "", stock: 0 });
			setFormError();
		} else {
			if (listSize.filter((d) => d.name === size.name).length > 0) {
				let dataListSize = [];
				listSize.forEach((item) => {
					if (item.name === size.name) {
						dataListSize = [
							...dataListSize,
							{ ...item, stock: size.stock },
						];
					} else {
						dataListSize = [...dataListSize, { ...item }];
					}
				});
				setListSize(dataListSize);
				setFormError();
			} else {
				toast.error("add size error");
			}
		}
	};

	const onClickRemoveSize = (name) => {
		setListSize(listSize.filter((item) => item.name !== name));
	};
	const [formError, setFormError] = useState();
	const [image, setImage] = useState();
	useEffect(() => {
		setImage(dataProduct?.attributes?.thumbnail?.data?.attributes);
		setListSize(
			dataProduct?.attributes?.sizes
				? [...dataProduct?.attributes?.sizes]
				: []
		);
	}, [dataProduct]);

	useEffect(() => {
		fetchCategories();
	}, [image]);

	const uploadMultiImage = async (e) => {
		const formData = new FormData();
		const data = e.target.files[0];
		formData.append("files", data);
		const url = "http://localhost:1337/api/upload";
		const config = {
			headers: {
				Authorization: `Bearer`,
				"Content-Type": "multipart/form-data",
			},
		};
		const res = await axios.post(url, formData, config);
		setImage(res.data[0]);
		setFormError();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (listSize.length === 0) {
				setFormError("List size is required");
			} else if (!image) {
				setFormError("Image is required");
			} else {
				setFormError();
			}

			if (listSize.length > 0 && image) {
				await onSubmit(e, image, listSize);
				e.target.reset();
				setImage(null);
			}
		} catch (err) {}
	};

	return (
		<form className="w-full mx-auto max-w-5xl p-10" onSubmit={handleSubmit}>
			<div className="flex flex-wrap -mx-3 mb-6">
				<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Name
					</label>
					<input
						className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						name="name"
						type="text"
						defaultValue={
							dataProduct && dataProduct.attributes.name
						}
						required
					/>
				</div>
				<div className="w-full md:w-1/2 px-3">
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Subtitle
					</label>
					<input
						className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						name="subtitle"
						type="text"
						defaultValue={
							dataProduct && dataProduct.attributes.subtitle
						}
						required
					/>
				</div>
			</div>
			<div className="flex flex-wrap -mx-3 mb-6">
				<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Price
					</label>
					<input
						className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						name="price"
						type="number"
						defaultValue={
							dataProduct && dataProduct.attributes.price
						}
						required
					/>
				</div>
				<div className="w-full md:w-1/2 px-3">
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Original price
					</label>
					<input
						className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						name="original_price"
						type="number"
						defaultValue={
							dataProduct && dataProduct.attributes.original_price
						}
						required
					/>
				</div>
			</div>
			<div className="flex flex-wrap -mx-3 mb-6">
				<div className="w-full px-3">
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Description
					</label>
					<textarea
						className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						rows="6"
						name="description"
						defaultValue={
							dataProduct && dataProduct.attributes.description
						}
						required
					></textarea>
				</div>
			</div>
			<div className="flex flex-wrap -mx-3 mb-6">
				<div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
					<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Categories
					</label>
					<div className="relative">
						<select
							className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							name="categories"
						>
							{categories?.map((item) => {
								return (
									<option
										value={item.id}
										key={item.id}
										selected={
											dataProduct?.attributes?.categories
												?.data[0]?.id ===
											item.attributes
										}
									>
										{item.attributes.name}
									</option>
								);
							})}
						</select>
						<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
							<svg
								className="fill-current h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full mb-6">
				<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
					Size
				</label>
				<div className="-mr-6 -ml-3">
					<div className="flex">
						<label className="w-full md:w-1/3 px-3 mb-6 md:mb-0 flex items-center">
							Name:
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								type="text"
								name="sizeName"
								onChange={onChangeSize}
								value={size.name}
							/>
						</label>
						<label className="w-full md:w-1/3 px-3 mb-6 md:mb-0 flex items-center">
							Stock:
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								name="stock"
								type="number"
								onChange={onChangeSize}
								value={size.stock}
							/>
						</label>
						<div
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
							onClick={onClickAddSize}
						>
							<FaPlus className="inline mr-3" />
							Add
						</div>
					</div>
					{listSize.length > 0 && (
						<div className="w-full px-3 mb-6 md:mb-0 flex">
							<p className="whitespace-nowrap">List size</p>
							<ul className="pl-5 w-full">
								{listSize.map((item, index) => {
									return (
										<li
											key={index}
											className="flex justify-between items-center w-full"
										>
											<div className="grid grid-cols-2 w-full">
												<div>Name: {item.name}</div>
												<div>stock: {item.stock}</div>
											</div>
											<FaRegWindowClose
												className="cursor-pointer"
												onClick={() =>
													onClickRemoveSize(item.name)
												}
											/>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-wrap -mx-3 mb-6">
				<div className="w-full px-3 ">
					<span className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
						Image
					</span>
					<div className="flex">
						{image ? (
							<div className="relative">
								<img
									src={"http://localhost:1337" + image.url}
									alt={image.name}
									width={200}
									height={200}
								/>
								<span
									className="text-red-300 cursor-pointer text-5xl absolute top-0 right-2"
									onClick={() => setImage(null)}
								>
									x
								</span>
							</div>
						) : (
							<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
								<input
									class="hidden w-auto he text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
									name="file_input[]"
									type="file"
									onChange={uploadMultiImage}
								/>
								<FaFileImage className="w-[120px] h-[120px] mt-5 cursor-pointer" />
							</label>
						)}
					</div>
				</div>
			</div>
			{formError && (
				<p class="text-red-500 text-xs italic">{formError}</p>
			)}
			<div className="flex justify-center">
				<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded flex items-center">
					Submit
				</button>
			</div>
		</form>
	);
};

export default FormProduct;
