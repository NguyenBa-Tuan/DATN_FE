import React, { useEffect, useState } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";

const HeroBanner = ({ products }) => {
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) {
		return null;
	}
	return (
		<div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto">
			<Carousel
				autoPlay={true}
				infiniteLoop={true}
				showThumbs={false}
				showIndicators={false}
				showStatus={false}
				renderArrowPrev={(clickHandler, hasPrev) => (
					<div
						onClick={clickHandler}
						className="absolute right-[31px] md:right-[51px] bottom-0 w-[30px] md:w-[50px] h-[30px] md:h-[50px] bg-black z-10 flex items-center justify-center cursor-pointer hover:opacity-90"
					>
						<BiArrowBack className="text-sm md:text-lg" />
					</div>
				)}
				renderArrowNext={(clickHandler, hasNext) => (
					<div
						onClick={clickHandler}
						className="absolute right-0 bottom-0 w-[30px] md:w-[50px] h-[30px] md:h-[50px] bg-black z-10 flex items-center justify-center cursor-pointer hover:opacity-90"
					>
						<BiArrowBack className="rotate-180 text-sm md:text-lg" />
					</div>
				)}
			>
				{products?.data.slice(1, 5).map((product) => {
					return (
						<div className="bg-gray-300" key={product.id}>
							<img
								src={
									"http://localhost:1337" +
									product?.attributes?.thumbnail?.data
										?.attributes.url
								}
								className="aspect-[16/10] md:aspect-auto object-contain max-h-[559px]"
							/>
							<div className="px-[15px] md:px-[40px] py-[10px] md:py-[25px] font-oswald bg-white absolute bottom-[25px] md:bottom-[75px] left-0 text-black/[0.9] text-[15px] md:text-[30px] uppercase font-medium cursor-pointer hover:opacity-90">
								<Link
									href={`/product/${product.attributes.slug}`}
								>
									Mua hàng ngay
								</Link>
							</div>
						</div>
					);
				})}
			</Carousel>
		</div>
	);
};

export default HeroBanner;
