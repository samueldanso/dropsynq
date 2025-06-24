import {
	getCoinsMostValuable,
	getCoinsNew,
	getCoinsTopGainers,
	getCoinsTopVolume24h,
} from "@zoralabs/coins-sdk";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const type = searchParams.get("type");

	try {
		let response;
		switch (type) {
			case "top-gainers":
				response = await getCoinsTopGainers({ count: 10 });
				break;
			case "top-volume":
				response = await getCoinsTopVolume24h({ count: 10 });
				break;
			case "most-valuable":
				response = await getCoinsMostValuable({ count: 10 });
				break;
			case "newest":
				response = await getCoinsNew({ count: 10 });
				break;
			default:
				return NextResponse.json(
					{ error: "Invalid discovery type" },
					{ status: 400 },
				);
		}
		// The actual coin data is nested under `data.exploreList.edges`
		const coins =
			response.data?.exploreList?.edges?.map((edge: any) => edge.node) || [];
		return NextResponse.json(coins);
	} catch (error) {
		console.error(`Failed to fetch ${type} coins:`, error);
		return NextResponse.json(
			{ error: "Failed to fetch discovery data" },
			{ status: 500 },
		);
	}
}
