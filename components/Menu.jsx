import Link from "next/link";
import React from "react";
import { BsChevronDown } from "react-icons/bs";

const data = [
	{ id: 1, name: "Trang Chủ", url: "/" },
	{ id: 3, name: "Danh Mục Sản Phẩm", subMenu: true },
];

const Menu = ({ showCatMenu, setShowCatMenu, categories }) => {
	return (
		<ul className="hidden md:flex items-center gap-8 font-medium text-black">
			{data.map((item) => {
				return (
					<React.Fragment key={item.id}>
						{item.subMenu ? (
							<li
								className="cursor-pointer flex items-center gap-2 relative"
								onMouseEnter={() => setShowCatMenu(true)}
								onMouseLeave={() => setShowCatMenu(false)}
							>
								{item.name}
								<BsChevronDown size={14} />

								{showCatMenu && (
									<ul className="bg-white absolute top-6 left-0 min-w-[250px] px-1 py-1 text-black shadow-lg">
										{categories?.map(
											({ attributes, id }) => {
												return (
													<Link
														key={id}
														href={`/category/${attributes.slug}`}
														onClick={() =>
															setShowCatMenu(
																false
															)
														}
													>
														<li className="h-12 flex justify-between items-center px-3 hover:bg-black/[0.03] rounded-md">
															{attributes.name}
															<span className="opacity-50 text-sm">
																{`(${attributes.products.data.length})`}
															</span>
														</li>
													</Link>
												);
											}
										)}
									</ul>
								)}
							</li>
						) : (
							<li className="cursor-pointer">
								<Link href={item?.url}>{item.name}</Link>
							</li>
						)}
					</React.Fragment>
				);
			})}
		</ul>
	);
};

export default Menu;
