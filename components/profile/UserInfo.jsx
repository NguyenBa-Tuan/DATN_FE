import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import Modal from "react-modal";
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

const UserInfo = ({ user, setUser }) => {
	const [userData, setUserData] = useState(user);
	const [showModel, setShowModel] = useReducer((prev) => !prev, false);
	const [formData, setFormData] = useState({});

	const changeHandler = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		setUserData(user);
	}, [user]);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = {
				...formData,
			};
			const url = `http://localhost:1337/api/users/${userData.id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};
			const dataUpdate = await axios.put(url, data, config);
			setUser(dataUpdate.data);
			setShowModel();
			if (formData.address) {
				const urlAddress = "http://localhost:1337/api/addresses";
				const dataAddress = {
					data: {
						address: formData.address,
						userId: String(userData.id),
					},
				};
				await axios.post(urlAddress, dataAddress, config);
			}
		} catch (err) {
			toast.error("Lỗi cập nhật");
		}
	};
	return (
		<div className="w-full">
			<Modal
				isOpen={showModel}
				style={customStyles}
				onRequestClose={setShowModel}
			>
				<form
					className="w-full mx-auto max-w-[990px] bg-white p-5"
					onSubmit={onSubmit}
				>
					<h3 class="text-base font-semibold leading-7 text-gray-900 text-center mb-5">
						Cập nhật thông tin
					</h3>
					<div className="flex">
						<div className="w-full md:w-1/2 px-3 mb-6 md:mb-3">
							<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
								Tên
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								name="username"
								type="text"
								defaultValue={userData && userData?.username}
								required
								onChange={changeHandler}
							/>
						</div>
						<div className="w-full md:w-1/2 px-3 mb-6 md:mb-3">
							<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
								Email
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								name="email"
								type="email"
								defaultValue={userData && userData?.email}
								required
								onChange={changeHandler}
							/>
						</div>
					</div>
					<div className="flex">
						<div className="w-full md:w-1/2 px-3 mb-6 md:mb-3">
							<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
								Số điện thoại
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								name="phone"
								type="tel"
								defaultValue={userData && userData?.phone}
								onChange={changeHandler}
							/>
						</div>
						<div className="w-full md:w-1/2 px-3 mb-6 md:mb-3">
							<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
								Mật khẩu
							</label>
							<input
								className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
								placeholder="Muốn thay đổi mật khẩu hãy nhập vào"
								name="password"
								type="password"
								onChange={changeHandler}
							/>
						</div>
					</div>
					<div className="w-full px-3">
						<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
							Địa chỉ
						</label>
						<textarea
							className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 resize-none"
							rows="6"
							name="address"
							defaultValue={userData && userData?.address}
							onChange={changeHandler}
						></textarea>
					</div>
					<div className="flex justify-around mt-5">
						<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded flex items-center">
							Cập nhật
						</button>
					</div>
				</form>
			</Modal>
			<div class="border-b border-gray-100">
				<dl class="divide-y divide-gray-100">
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900">
							Họ tên
						</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{userData && userData?.username}
						</dd>
					</div>
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900">
							Email
						</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{userData && userData?.email}
						</dd>
					</div>
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900">
							Số điện thoại
						</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{(userData && userData?.phone) ||
								"Bạn chưa thêm số điện thoại"}
						</dd>
					</div>
					<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
						<dt class="text-sm font-medium leading-6 text-gray-900">
							Địa chỉ
						</dt>
						<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
							{(userData && userData?.address) ||
								"Bạn chưa thêm số địa chỉ"}
						</dd>
					</div>
				</dl>
			</div>
			<div className="flex justify-around mt-5">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded flex items-center"
					onClick={setShowModel}
				>
					Cập nhật thông tin
				</button>
			</div>
		</div>
	);
};

export default UserInfo;
