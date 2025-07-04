import { getProfile } from "@zoralabs/coins-sdk";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schemas";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ handle: string }> },
) {
	const { handle } = await params;
	const { searchParams } = new URL(request.url);
	const limit = parseInt(searchParams.get("limit") || "20");
	const offset = parseInt(searchParams.get("offset") || "0");

	try {
		// 1. Get the user's wallet address from their handle
		const profileResponse = await getProfile({ identifier: handle });
		const userAddress =
			profileResponse?.data?.profile?.publicWallet?.walletAddress;

		if (!userAddress) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// 2. Get all songs this user has liked
		const userLikes = await db
			.select({
				coin_address: likes.coin_address,
				created_at: likes.created_at,
			})
			.from(likes)
			.where(eq(likes.user_address, userAddress))
			.orderBy(likes.created_at)
			.limit(limit)
			.offset(offset);

		return NextResponse.json({ data: userLikes });
	} catch (error) {
		console.error(`Failed to fetch likes for ${handle}:`, error);
		return NextResponse.json(
			{ error: "Failed to fetch user likes" },
			{ status: 500 },
		);
	}
}
