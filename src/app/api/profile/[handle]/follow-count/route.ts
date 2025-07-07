import { getProfile } from "@zoralabs/coins-sdk";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { follows } from "@/lib/db/schemas";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ handle: string }> },
) {
	const { handle } = await params;

	try {
		// Get the user's wallet address from their handle
		const profileResponse = await getProfile({ identifier: handle });
		const userAddress =
			profileResponse?.data?.profile?.publicWallet?.walletAddress;

		if (!userAddress) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Get follower count (people following this user)
		const followersCount = await db
			.select({ count: follows.id })
			.from(follows)
			.where(eq(follows.followee_address, userAddress));

		// Get following count (people this user is following)
		const followingCount = await db
			.select({ count: follows.id })
			.from(follows)
			.where(eq(follows.follower_address, userAddress));

		return NextResponse.json({
			data: {
				followers: followersCount.length,
				following: followingCount.length,
			},
		});
	} catch (error) {
		console.error(`Failed to fetch follow counts for ${handle}:`, error);
		return NextResponse.json(
			{ error: "Failed to fetch follow counts" },
			{ status: 500 },
		);
	}
}
