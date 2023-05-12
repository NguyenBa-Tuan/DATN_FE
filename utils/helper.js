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

const makeMoneyFormatter =
	({
		sign = "$",
		delimiter = ",",
		decimal = ".",
		append = false,
		precision = 2,
		round = true,
		custom,
	} = {}) =>
	(value) => {
		const e = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];

		value = round
			? Math.round(value * e[precision]) / e[precision]
			: parseFloat(value);

		const pieces = value.toFixed(precision).replace(".", decimal).split("");

		let ii = pieces.length - (precision ? precision + 1 : 0);

		while ((ii -= 3) > 0) {
			pieces.splice(ii, 0, delimiter);
		}

		if (typeof custom === "function") {
			return custom({
				sign,
				float: value,
				value: pieces.join(""),
			});
		}

		return append ? pieces.join("") + sign : sign + pieces.join("");
	};

export const formatPound = makeMoneyFormatter({
	sign: "",
	precision: 0,
});
