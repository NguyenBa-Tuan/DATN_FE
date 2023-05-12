import Wrapper from "@/components/Wrapper";
import { userData } from "@/utils/helper";
import React, { useEffect, useState } from "react";
import UserInfo from "@/components/profile/UserInfo";
import { useRouter } from "next/router";
import { STRAPI_API_TOKEN } from "@/utils/urls";
import axios from "axios";

const profile = () => {
	const [user, setUser] = useState(undefined);
	const router = useRouter();
	useEffect(() => {
		const { user } = userData();
		(async () => {
			const url = `http://localhost:1337/api/users/${user.id}`;
			const config = {
				headers: {
					Authorization: `Bearer ${STRAPI_API_TOKEN}`,
				},
			};

			const { data } = await axios.get(url, { ...config });
			setUser(data);
		})();
		if (user === undefined) router.push("/");
	}, [setUser]);

	return (
		<Wrapper className="min-h-screen">
			<div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px]">
				<h1 className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
					Trang thông tin người dùng
				</h1>
			</div>

			<div className="flex w-full">
				<UserInfo user={user} setUser={setUser} />
			</div>
		</Wrapper>
	);
};

export default profile;
