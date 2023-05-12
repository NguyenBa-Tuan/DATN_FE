import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const maxResult = 5;

const CommentSection = ({ pId, user, jwt }) => {
	const [listComments, setListComments] = useState([]);
	const [showUpdate, setShowUpdate] = useState();
	const [pageStart, setPageStart] = useState(0);
	const [countComment, setCountComment] = useState(0);

	const getListComments = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${STRAPI_API_TOKEN}`,
			},
		};
		const url = `http://localhost:1337/api/comments?populate=*&[filters][productId]=${pId}&pagination[start]=${pageStart}&pagination[limit]=${maxResult}`;
		const data = await axios.get(url, { ...config });
		setListComments(data.data || []);
		setCountComment(data?.data?.meta?.pagination.total || 0);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:1337/api/comments`;
			const data = {
				data: {
					productId: String(pId),
					userId: String(user.id),
					comment: e.target.comment.value,
					users_permissions_user: user.id,
				},
			};
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.post(url, data, config);
			getListComments();
			e.target.reset();
		} catch (e) {
			toast.error("Bạn phải đăng nhập trước khi bình luận");
		}
	};

	useEffect(() => {
		getListComments();
	}, [pageStart]);

	const onUpdate = async (e) => {
		e.preventDefault();
		try {
			const url = `http://localhost:1337/api/comments/${showUpdate}`;
			const data = {
				data: {
					comment: e.target.comment.value,
				},
			};
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.put(url, data, config);
			setShowUpdate(undefined);
			getListComments();
		} catch (e) {
			toast.error("Lỗi cập nhật bình luận");
		}
	};

	const onDelete = async (id) => {
		try {
			const url = `http://localhost:1337/api/comments/${id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			};
			await axios.delete(url, config);
			getListComments();
		} catch (e) {
			toast.error("Lỗi xóa bình luận");
		}
	};
	return (
		<section class="bg-white dark:bg-gray-900 pt-8 lg:pt-16">
			<div class="mx-auto px-4">
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
						Bình luận ({listComments?.data?.length})
					</h2>
				</div>
				<form class="mb-6" onSubmit={onSubmit}>
					<div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
						<label for="comment" class="sr-only">
							Your comment
						</label>
						<textarea
							id="comment"
							rows="6"
							class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
							placeholder="Nhập bình luận..."
							required
							name="comment"
						></textarea>
					</div>
					<button
						type="submit"
						class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
					>
						Thêm bình luận
					</button>
				</form>
				{listComments?.data?.map((item) => {
					const date = new Date(item.attributes.createdAt);
					return (
						<article class="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
							<footer class="flex justify-between items-center mb-2">
								<div class="flex items-center">
									<p
										class={`inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white ${
											user?.id ===
												item?.attributes
													?.users_permissions_user
													?.data?.id &&
											"text-blue-800 font-semibold"
										}`}
									>
										<img
											class="mr-2 w-6 h-6 rounded-full"
											src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
											alt={
												item?.attributes
													?.users_permissions_user
													?.data?.attributes?.username
											}
										/>
										{
											item?.attributes
												?.users_permissions_user?.data
												?.attributes?.username
										}
									</p>
									<p class="text-sm text-gray-600 dark:text-gray-400">
										<time
											pubdate
											datetime={
												date.getDate() +
												"/" +
												(date.getMonth() + 1) +
												"/" +
												date.getFullYear()
											}
										>
											{date.getDate() +
												"/" +
												(date.getMonth() + 1) +
												"/" +
												date.getFullYear()}
										</time>
									</p>
								</div>
								{(user?.id ===
									item?.attributes?.users_permissions_user
										?.data?.id ||
									user?.userRole === "admin") && (
									<button
										class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600 group relative"
										type="button"
									>
										<svg
											class="w-5 h-5"
											aria-hidden="true"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
										</svg>
										<span class="sr-only">
											Comment settings
										</span>
										<div class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 group-hover:block absolute top-0 right-0">
											<ul
												class="py-1 text-sm text-gray-700 dark:text-gray-200"
												aria-labelledby="dropdownMenuIconHorizontalButton"
											>
												<li>
													<button
														onClick={() =>
															setShowUpdate(
																item.id
															)
														}
														class="block w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
													>
														Edit
													</button>
												</li>
												<li>
													<button
														onClick={() =>
															onDelete(item.id)
														}
														class="block w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
													>
														Remove
													</button>
												</li>
											</ul>
										</div>
									</button>
								)}
							</footer>
							<p class="text-gray-500 dark:text-gray-400">
								{showUpdate && showUpdate === item.id ? (
									<form class="mb-6" onSubmit={onUpdate}>
										<div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
											<label
												for="comment"
												class="sr-only"
											>
												Your comment
											</label>
											<textarea
												id="comment"
												rows="6"
												class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
												defaultValue={
													item?.attributes?.comment
												}
												required
												name="comment"
											></textarea>
										</div>
										<button
											type="submit"
											class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
										>
											Cập nhật bình luận
										</button>
									</form>
								) : (
									item?.attributes?.comment
								)}
							</p>
							{/* <div class="flex items-center mt-4 space-x-4">
								<button
									type="button"
									class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
								>
									<svg
										aria-hidden="true"
										class="mr-1 w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										></path>
									</svg>
									Reply
								</button>
							</div> */}
						</article>
					);
				})}
				{countComment / maxResult - 1 >= pageStart && (
					<>
						<div className="flex items-center justify-center gap-5">
							{pageStart > 0 && (
								<button
									className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
									onClick={() =>
										setPageStart((prev) => prev - 1)
									}
								>
									Quay lại
								</button>
							)}
							{countComment / maxResult - 1 > pageStart && (
								<button
									className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
									onClick={() =>
										setPageStart((prev) => prev + 1)
									}
								>
									Bình luận tiếp theo
								</button>
							)}
						</div>
					</>
				)}
			</div>
		</section>
	);
};

export default CommentSection;
