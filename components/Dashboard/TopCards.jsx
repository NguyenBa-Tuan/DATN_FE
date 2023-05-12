import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { formatPound } from "@/utils/helper";

const TopCards = (data) => {
	const [currentDateData, setCurrentDateData] = useState(data);

	useEffect(() => {
		setCurrentDateData(data);
	}, [data]);

	return (
		<div className="grid lg:grid-cols-5 gap-4 p-4 col-span-2">
			<div className="lg:col-span-1 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
				<div className="flex flex-col w-full pb-4">
					<p className="text-2xl font-bold">
						{!isEmpty(currentDateData)
							? formatPound(currentDateData?.data[0]?.totalPrice)
							: "0"}{" "}
						VND
					</p>
					<p className="text-gray-600">Danh thu tháng</p>
				</div>
				<p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
					<span className="text-green-700 text-lg">+11%</span>
				</p>
			</div>
			<div className="bg-white flex justify-between w-full border p-4 rounded-lg">
				<div className="flex flex-col w-full pb-4">
					<p className="text-2xl font-bold">
						{!isEmpty(currentDateData)
							? currentDateData?.data[0]?.numberBuyer
							: "0"}
					</p>
					<p className="text-gray-600">
						Số lượng đơn hàng trong tháng
					</p>
				</div>
				<p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
					<span className="text-green-700 text-lg">+17%</span>
				</p>
			</div>
		</div>
	);
};

export default TopCards;
