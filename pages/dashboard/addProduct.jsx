import FormProduct from "@/components/Dashboard/FormProduct";
import Sidebar from "@/components/Dashboard/Sidebar";
import React from "react";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import { toast } from "react-toastify";
import axios from "axios";

const addProduct = () => {
	const onSubmit = async (e, image, listSize) => {
		e.preventDefault();
		try {
			const url = "http://localhost:1337/api/products";
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};

			const slugVietnamese = (str) => {
				str = str.replace(/^\s+|\s+$/g, ""); // trim
				str = str.toLowerCase();

				// remove accents, swap ñ for n, etc
				var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
				var to = "aaaaaeeeeeiiiiooooouuuunc------";
				for (var i = 0, l = from.length; i < l; i++) {
					str = str.replace(
						new RegExp(from.charAt(i), "g"),
						to.charAt(i)
					);
				}

				str = str
					.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
					.replace(/\s+/g, "-") // collapse whitespace and replace by -
					.replace(/-+/g, "-"); // collapse dashes

				return str;
			};

			let slug = e.target.name.value;

			slug = slugVietnamese(slug);
			slug = slug + "-" + Math.floor(Math.random() * 900000) + 100000;

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
					slug: slug,
				},
			};
			await axios.post(url, data, config);
			toast.success("Add product successfully");
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
				<h1 className="text-center text-3xl mb-[3rem]">Add product</h1>
				<FormProduct onSubmit={onSubmit} />
			</div>
		</Sidebar>
	);
};

export default addProduct;
