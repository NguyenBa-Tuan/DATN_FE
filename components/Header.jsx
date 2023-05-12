import React, { useState, useEffect, useReducer, useCallback } from "react";
import Wrapper from "./Wrapper";

import Link from "next/link";
import Menu from "./Menu";
import MenuMobile from "./MenuMobile";

import { IoMdHeartEmpty } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { BiMenuAltRight } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { fetchDataFromApi } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { userData } from "@/utils/helper";
import { useRouter } from "next/router";
import axios from "axios";
import {
	getToCart,
	setCardId,
	setListCategories,
	setListFavorites,
} from "@/store/cartSlice";

const Header = () => {
	const [mobileMenu, setMobileMenu] = useState(false);
	const [showCatMenu, setShowCatMenu] = useState(false);
	const [show, setShow] = useState("translate-y-0");
	const [lastScrollY, setLastScrollY] = useState(0);
	const [categories, setCategories] = useState(null);
	const [user, setUser] = useState();
	const [showUserDropdown, setShowUserDropdown] = useReducer(
		(prev) => !prev,
		false
	);
	const router = useRouter();

	const dispatch = useDispatch();

	const { cartItems, listFavorite } = useSelector((state) => state.cart);

	const controlNavbar = () => {
		if (window.scrollY > 200) {
			if (window.scrollY > lastScrollY && !mobileMenu) {
				setShow("-translate-y-[80px]");
			} else {
				setShow("shadow-sm");
			}
		} else {
			setShow("translate-y-0");
		}
		setLastScrollY(window.scrollY);
	};

	useEffect(() => {
		window.addEventListener("scroll", controlNavbar);
		return () => {
			window.removeEventListener("scroll", controlNavbar);
		};
	}, [lastScrollY]);

	const fetchCategories = async () => {
		const { data } = await fetchDataFromApi("/api/categories?populate=*");
		setCategories(data);
		dispatch(setListCategories(categories || []));
	};

	const getCartApi = async (user, jwt) => {
		const config = {
			headers: { Authorization: `Bearer ${jwt}` },
		};

		const url2 = `http://localhost:1337/api/cards/user/${user.id}`;
		const data2 = await axios.get(url2, { ...config });
		let product = [];
		data2.data[0].map((item) => {
			product = [
				...product,
				{
					product_id: item.product_id,
					size: item.size,
					count: item.count,
				},
			];
		});

		const url3 = `http://localhost:1337/api/products?populate=*`;
		const data3 = await axios.get(url3, { ...config });
		let data5 = [];

		data3.data.data.forEach((item) => {
			product.map((data) => {
				if (data.product_id == item.id) {
					data5.push({ ...item, size: data.size, count: data.count });
				}
			});
		});

		dispatch(getToCart(data5 || []));
		dispatch(setCardId(data5));
	};

	const getListFavorites = async (user, jwt) => {
		const config = {
			headers: { Authorization: `Bearer ${jwt}` },
		};

		const url = `http://localhost:1337/api/favorite-products?[filters][userId]=${user.id}`;
		const { data } = await axios.get(url, { ...config });
		dispatch(setListFavorites(data.data));
	};

	useEffect(() => {
		const { user, jwt } = userData();
		setUser(user);
		fetchCategories();
		if (user) {
			getListFavorites(user, jwt);
			getCartApi(user, jwt);
		}
	}, [dispatch, router]);

	const logout = useCallback(() => {
		localStorage.setItem("user", "");
		setShowUserDropdown();
		router.push("/");
		dispatch(getToCart([]));
	}, [router]);

	return (
		<header
			className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}
		>
			<Wrapper className="h-[60px] flex justify-between items-center md:!px-0">
				<Link href="/">
					<img src="/logo.svg" className="w-[40px] md:w-[60px]" />
				</Link>

				<Menu
					showCatMenu={showCatMenu}
					setShowCatMenu={setShowCatMenu}
					categories={categories}
				/>

				{mobileMenu && (
					<MenuMobile
						showCatMenu={showCatMenu}
						setShowCatMenu={setShowCatMenu}
						setMobileMenu={setMobileMenu}
						categories={categories}
					/>
				)}

				<div className="flex items-center gap-2 text-black">
					{/* Mobile icon start */}
					<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex md:hidden justify-center items-center hover:bg-black/[0.05] cursor-pointer relative -mr-2">
						{mobileMenu ? (
							<VscChromeClose
								className="text-[16px]"
								onClick={() => setMobileMenu(false)}
							/>
						) : (
							<BiMenuAltRight
								className="text-[20px]"
								onClick={() => setMobileMenu(true)}
							/>
						)}
					</div>
					{/* Mobile icon end */}
					{user?.username ? (
						<>
							{/* Icon start */}
							<Link href="/favorite">
								<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
									<IoMdHeartEmpty className="text-[19px] md:text-[24px]" />
									<div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
										{listFavorite?.length || 0}
									</div>
								</div>
							</Link>
							{/* Icon end */}

							{/* Icon start */}
							<Link href="/cart">
								<div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
									<BsCart className="text-[15px] md:text-[20px]" />
									{cartItems?.length > 0 && (
										<div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
											{cartItems.length}
										</div>
									)}
								</div>
							</Link>
							{/* Icon end */}
							<div className="flex gap-2 relative">
								<p className="font-medium text-black">
									{user.username}
								</p>
								<FaUserCircle className="text-[24px]" />
								<button onClick={setShowUserDropdown}>
									<FaChevronDown />
								</button>
								{showUserDropdown && (
									<div className="absolute text-base float-left py-2 list-none text-left rounded shadow-lg mt-1 z-[99999] bg-white min-w-[150px] top-[110%] right-0">
										{user.userRole === "admin" && (
											<Link
												className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-slate-200"
												href={"/dashboard"}
											>
												Trang quản lý
											</Link>
										)}
										<Link
											className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-slate-200"
											href={"/profile"}
										>
											Trang thông tin
										</Link>
										<Link
											className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-slate-200"
											href={"/orderHistory"}
										>
											Lịch sử mua hàng
										</Link>
										<div
											className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent hover:bg-slate-200 cursor-pointer"
											onClick={logout}
										>
											Đăng xuất
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<Link
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								href={"/login"}
							>
								Đăng nhập
							</Link>

							<Link
								class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
								href={"/register"}
							>
								Đăng kí
							</Link>
						</>
					)}
				</div>
			</Wrapper>
		</header>
	);
};

export default Header;
