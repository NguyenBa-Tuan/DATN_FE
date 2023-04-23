import Wrapper from "@/components/Wrapper";
import { storeUser } from "@/utils/helper";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

const iniUser = { password: "", identifier: "" };
const login = () => {
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

	const handleLogin = async () => {
		const url = "http://localhost:1337/api/auth/local";
		try {
			if (user.identifier && user.password) {
				const { data } = await axios.post(url, user);
				if (data.jwt) {
					storeUser(data);
					toast.success("login successfully");
					setUser(iniUser);
					router.push("/");
				}
			}
		} catch (err) {
			toast.error(err.message);
		}
	};
	return (
		<Wrapper>
			<div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
				<div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
					<h1 className="text-3xl font-semibold text-center text-purple-700 underline">
						Đăng nhập
					</h1>
					<div className="mt-6">
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
								name="identifier"
								value={user.identifier}
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
						<a
							href="#"
							className="text-xs text-purple-600 hover:underline"
						>
							Quên mật khẩu?
						</a>
						<div className="mt-6">
							<button
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
								onClick={handleLogin}
							>
								Đăng nhập
							</button>
						</div>
					</div>

					<p className="mt-8 text-xs font-light text-center text-gray-700">
						Bạn không có tài khoản
						<Link
							href="/register"
							className="font-medium text-purple-600 hover:underline"
						>
							Đăng kí
						</Link>
					</p>
				</div>
			</div>
		</Wrapper>
	);
};

export default login;
