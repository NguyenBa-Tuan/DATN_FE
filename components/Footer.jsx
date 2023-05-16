import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import Wrapper from "./Wrapper";

const Footer = () => {
	return (
		<footer className="bg-black text-white pt-3 pb-3">
			<Wrapper className="flex justify-between mt-3 flex-col md:flex-row gap-[10px] md:gap-0">
				{/* LEFT START */}
				<div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer text-center md:text-left">
					© 2023 Nike, Inc. All Rights Reserved
				</div>
				{/* LEFT END */}

				{/* RIGHT START */}
				<div className="flex gap-2 md:gap-5 text-center md:text-left flex-wrap justify-center">
					<div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
						<Link href={"/"}>Trang chủ</Link>
					</div>
					<div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
						<Link href={"/favorite"}>Sản phẩm yêu thích</Link>
					</div>
					<div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
						<Link href={"/cart"}>Giỏ hàng</Link>
					</div>
				</div>
				{/* RIGHT END */}
			</Wrapper>
		</footer>
	);
};

export default Footer;
