import { formatPound, getDiscountedPricePercentage } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const ProductCard = ({ data: { attributes: p, id } }) => {
	return (
		<Link
			href={`/product/${p.slug}`}
			className="transform overflow-hidden bg-white duration-200 hover:scale-105 cursor-pointer"
		>
			<Image
				width={500}
				height={500}
				src={
					p.thumbnail.data?.attributes.url
						? "http://localhost:1337" +
						  p.thumbnail.data?.attributes.url
						: ""
				}
				alt={p.name}
			/>
			<div className="p-4 text-black/[0.9]">
				<h2 className="text-lg font-medium">{p.name}</h2>
				<div className="flex items-center text-black/[0.5]">
					<p className="mr-2 text-lg font-semibold">
						{formatPound(p.price)} VND
					</p>

					{p.original_price && (
						<>
							{p.original_price > p.price && (
								<p className="text-base  font-medium line-through">
									{formatPound(p.original_price)} VND
								</p>
							)}
							<p className="ml-auto text-base font-medium text-green-500">
								Giảm -
								{p.original_price > p.price
									? getDiscountedPricePercentage(
											p.original_price,
											p.price
									  )
									: "0"}
								%
							</p>
						</>
					)}
				</div>
			</div>
		</Link>
	);
};

export default ProductCard;
