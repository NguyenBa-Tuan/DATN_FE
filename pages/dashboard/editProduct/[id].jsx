import React, { useEffect, useState } from "react";
import FormProduct from "@/components/Dashboard/FormProduct";
import Sidebar from "@/components/Dashboard/Sidebar";
import { useRouter } from "next/router";
import { fetchDataFromApi } from "@/utils/api";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";
import { toast } from "react-toastify";

const editProduct = () => {
	const router = useRouter();
	const { id } = router.query;
	const [dataProduct, setDataProduct] = useState();
	const fetchCategories = async () => {
		const { data } = await fetchDataFromApi(
			`/api/products/${id}?populate=*`
		);
		setDataProduct(data);
	};
	useEffect(() => {
		fetchCategories();
	}, [router]);

	const onSubmit = async (e, image, listSize) => {
		e.preventDefault();
		try {
			const url = `http://localhost:1337/api/products/${id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};

			const data = {
				data: {
					categories: {
						connect: [
							{
								id: e.target.categories.value,
								position: { end: true },
							},
						],
						disconnect: [],
					},
					description: e.target.description.value,
					name: e.target.name.value,
					original_price: e.target.original_price.value,
					price: e.target.price.value,
					sizes: listSize,
					subtitle: e.target.subtitle.value,
					thumbnail: image?.id,
				},
			};

			await axios.put(url, data, config);
			toast.success("Update product successfully");
		} catch (e) {
			toast.error(e.message);
		}
	};
	return (
		<Sidebar>
			<div className="flex justify-between p-4">
				<h2>Customers</h2>
				<h2>Welcome Back, Clint</h2>
			</div>
			<div>
				<h1 className="text-center text-3xl mb-[3rem]">Edit product</h1>
				<FormProduct dataProduct={dataProduct} onSubmit={onSubmit} />
			</div>
		</Sidebar>
	);
};

export default editProduct;
