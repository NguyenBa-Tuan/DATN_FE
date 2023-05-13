import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
import { fetchDataFromApi } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
const maxResult = 9;

export default function Home({ products }) {
	const [pageIndex, setPageIndex] = useState(1);
	const { query } = useRouter();

	useEffect(() => {
		setPageIndex(1);
	}, [query, products]);

	const { data, error, isLoading } = useSWR(
		`/api/products?populate=*&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}&sort[0][createdAt]=desc${
			query?.search ? "&[filters][name][$contains]=" + query.search : ""
		}`,
		fetchDataFromApi,
		{
			fallbackData: products,
		}
	);
	return (
		<main>
			{data?.data?.length < 1 ? (
				<div className="h-screen">
					<h2 className="text-center text-4xl pt-20">
						Sản phẩm bạn tìm kiếm không tồn tại
						<Link href={"/"} className="block mt-5 text-blue-500">
							Click vào đây để quay lại trang chủ
						</Link>
					</h2>
				</div>
			) : (
				<>
					<HeroBanner products={data} />
					<Wrapper>
						<div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px]">
							<div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
								Danh sách sản phẩm của chúng tôi
							</div>
							<div className="text-md md:text-xl">
								Bạn có thể xem những sản phẩm của chúng tôi. Lựa
								chọn sản phầm yêu thích của bạn và thêm vào giỏ
								hàng!
							</div>
						</div>
						<div className="mb-14">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
								{data?.data?.map((product) => (
									<ProductCard
										key={product?.id}
										data={product}
									/>
								))}
							</div>
							{data?.meta?.pagination?.total > maxResult && (
								<div className="flex gap-3 items-center justify-center my-16 md:my-0">
									<button
										className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
										disabled={pageIndex === 1}
										onClick={() =>
											setPageIndex(pageIndex - 1)
										}
									>
										Previous
									</button>

									<span className="font-bold">{`${pageIndex} of ${
										data && data.meta.pagination.pageCount
									}`}</span>

									<button
										className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`}
										disabled={
											pageIndex ===
											(data &&
												data.meta.pagination.pageCount)
										}
										onClick={() =>
											setPageIndex(pageIndex + 1)
										}
									>
										Next
									</button>
								</div>
							)}
							{isLoading && (
								<div className="absolute top-0 left-0 w-full h-full bg-white/[0.5] flex flex-col gap-5 justify-center items-center">
									<img src="/logo.svg" width={150} />
									<span className="text-2xl font-medium">
										Loading...
									</span>
								</div>
							)}
						</div>
					</Wrapper>
				</>
			)}
		</main>
	);
}

export async function getStaticProps() {
	const products = await fetchDataFromApi(
		`/api/products?populate=*&pagination[page]=1&pagination[pageSize]=${maxResult}`
	);

	return {
		props: { products },
	};
}
