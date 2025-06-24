import { getCoins, getProfile } from "@zoralabs/coins-sdk";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { Address } from "viem";
import { db } from "@/lib/db";
import { tracks } from "@/lib/db/schemas/tracks";

export async function GET(
	_request: Request,
	{ params }: { params: { username: string } },
) {
	const { username } = params;

	try {
		// 1. Get the user's wallet address from their username
		const profileResponse = await getProfile({ identifier: username });
		const userAddress = profileResponse?.data?.profile?.address;

		if (!userAddress) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// 2. Query our database for the coin addresses created by that user
		const userTrackRecords = await db.query.tracks.findMany({
			where: eq(tracks.creator_address, userAddress),
			columns: {
				coin_address: true,
			},
		});

		if (!userTrackRecords || userTrackRecords.length === 0) {
			return NextResponse.json([]);
		}

		// 3. Use the addresses to fetch full, correctly-formatted coin data from Zora
		const coinAddresses = userTrackRecords.map(
			(t) => t.coin_address as Address,
		);
		const coinsResponse = await getCoins({
			coinAddresses,
		} as any);

		const userCoins = coinsResponse.data?.zora20Tokens || [];

		return NextResponse.json(userCoins);
	} catch (error) {
		console.error(`Failed to fetch tracks for ${username}:`, error);
		return NextResponse.json(
			{ error: "Failed to fetch user tracks" },
			{ status: 500 },
		);
	}
}
