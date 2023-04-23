import Wrapper from "@/components/Wrapper";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const iniUser = { password: "", email: "", username: "" };
const register = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [user, setUser] = useState(iniUser);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const router = useRouter();

	const handleChange = ({ target }) => {
		const { name, value } = target;
		setUser((currentUser) => ({
			...currentUser,
			[name]: value,
		}));
	};

	const signUp = async () => {
		try {
			const url = "http://localhost:1337/api/auth/local/register";
			if (user.email && user.password && user.username) {
				const res = await axios.post(url, user);
				toast.success("Create successfully");
				if (res) {
					setUser(iniUser);
					router.push("/login");
				}
			}
		} catch (error) {
			toast.error(error.message);
		}
	};
	return (
		<Wrapper>
			<div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
				<div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
					<h1 className="text-3xl font-semibold text-center text-purple-700 underline">
						Đăng kí
					</h1>
					<div className="mt-6">
						<div className="mb-2">
							<label
								for="identifier"
								className="block text-sm font-semibold text-gray-800"
							>
								Họ tên
							</label>
							<input
								type="text"
								className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
								name="username"
								value={user.username}
								onChange={handleChange}
							/>
						</div>
						<div className="mb-2">
							<label
								for="identifier"
								className="block text-sm font-semibold text-gray-800"
							>
								Email
							</label>
							<input
								type="email"
								className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
								name="email"
								value={user.email}
								onChange={handleChange}
							/>
						</div>
						<div className="mb-2">
							<label
								for="password"
								className="block text-sm font-semibold text-gray-800"
							>
								Mật khẩu
							</label>
							<input
								type="password"
								className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
								name="password"
								value={user.password}
								onChange={handleChange}
							/>
						</div>
						<div className="mt-6">
							<button
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
								onClick={signUp}
							>
								Đăng kí
							</button>
						</div>
					</div>

					<p className="mt-8 text-xs font-light text-center text-gray-700">
						Bạn đã có tài khoản
						<Link
							href="/login"
							className="font-medium text-purple-600 hover:underline"
						>
							Đăng nhập
						</Link>
					</p>
				</div>
			</div>
		</Wrapper>
	);
};

export default register;
