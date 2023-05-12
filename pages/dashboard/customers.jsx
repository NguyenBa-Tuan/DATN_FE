import Sidebar from "@/components/Dashboard/Sidebar";
import { userData } from "@/utils/helper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	BsPersonFill,
	BsThreeDotsVertical,
	BsFillTrash3Fill,
} from "react-icons/bs";
import { toast } from "react-toastify";
const maxResult = 10;

const customers = () => {
	const [usersData, setUsersData] = useState();
	const [pageStart, setPageStart] = useState(1);
	const [countUser, setCountUser] = useState(0);
	const getListUser = async () => {
		try {
			const url = `http://localhost:1337/api/users?start=${pageStart}&limit=${maxResult}`;
			const urlGetCount = "http://localhost:1337/api/users/count";
			const { user, jwt } = userData();
			if (user && jwt) {
				const config = {
					url,
					headers: { Authorization: `Bearer ${jwt}` },
				};
				const countUser = await axios.get(urlGetCount, { ...config });

				setCountUser(countUser.data);
				if (
					countUser.data / maxResult >= pageStart ||
					(countUser.data / maxResult < 1 &&
						countUser.data / maxResult <= pageStart)
				) {
					const data = await axios.get(url, { ...config });
					setUsersData(data.data);
				}
			}
		} catch (err) {
			toast.error("Đã xảy ra lỗi");
		}
	};
	useEffect(() => {
		getListUser();
	}, [pageStart]);

	const onDeleteUser = async (id) => {
		try {
			const { jwt } = userData();
			const url = `http://localhost:1337/api/users/${id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.delete(url, config);
			getListUser();
		} catch (err) {
			toast.error("Lỗi xóa người dùng");
		}
	};

	return (
		<Sidebar>
			<div className="bg-gray-100 min-h-screen">
				<div className="flex justify-between p-4">
					<h2>Customers</h2>
					<h2>Welcome Back, Clint</h2>
				</div>
				<div className="p-4">
					<div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
						<div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
							<span>Họ tên</span>
							<span className="sm:text-left text-right">
								Email
							</span>
							<span className="hidden md:grid">Quyền</span>
							<span className="hidden sm:grid"></span>
						</div>
						<ul>
							{usersData?.map((item) => {
								return (
									<li className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
										<div className="flex items-center">
											<div className="bg-purple-100 p-3 rounded-lg">
												<BsPersonFill className="text-purple-800" />
											</div>
											<p className="pl-4">
												{item?.username}
											</p>
										</div>
										<p className="text-gray-600 sm:text-left text-right">
											{item?.email}
										</p>
										<p className="hidden md:flex">
											{item?.userRole === "admin"
												? "Quản trị viên"
												: "Người dùng"}
										</p>
										<div className="sm:flex hidden justify-end items-center">
											<div className="flex gap-5 ">
												<div
													onClick={() =>
														onDeleteUser(item.id)
													}
												>
													<BsFillTrash3Fill />
												</div>
												<BsThreeDotsVertical />
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				{countUser / maxResult >= pageStart && (
					<>
						<div className="flex items-center justify-center gap-5">
							{pageStart > 1 && (
								<button
									className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
									onClick={() =>
										setPageStart((prev) => prev - 1)
									}
								>
									Quay lại
								</button>
							)}
							{countUser / maxResult > pageStart && (
								<button
									className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
									onClick={() =>
										setPageStart((prev) => prev + 1)
									}
								>
									Trang tiếp theo
								</button>
							)}
						</div>
					</>
				)}
			</div>
		</Sidebar>
	);
};

export default customers;
