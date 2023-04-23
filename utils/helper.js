import { useEffect } from "react";

export const getDiscountedPricePercentage = (
	originalPrice,
	discountedPrice
) => {
	const discount = originalPrice - discountedPrice;

	const discountPercentage = (discount / originalPrice) * 100;

	return discountPercentage.toFixed(2);
};

export const storeUser = (data) => {
	localStorage.setItem("user", JSON.stringify({ ...data, jwt: data.jwt }));
};

export const userData = () => {
	const localUser = localStorage.getItem("user") || {};
	return Object.keys(localUser).length > 0 ? JSON.parse(localUser) : {};
};

export const Protector = ({ component }) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const router = useRouter();

	const { jwt } = userData();

	useEffect(() => {
		if (!jwt) {
			router.push("/");
		}
	}, [jwt, router]);
};
