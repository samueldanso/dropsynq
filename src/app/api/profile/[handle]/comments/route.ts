import "@/lib/zora";
import { getProfile } from "@zoralabs/coins-sdk";
import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schemas";

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

		// 2. Get all comments this user has made
		const userComments = await db
			.select({
				id: comments.id,
				coin_address: comments.coin_address,
				comment_text: comments.comment_text,
				created_at: comments.created_at,
			})
			.from(comments)
			.where(eq(comments.user_address, userAddress))
			.orderBy(desc(comments.created_at))
			.limit(limit)
			.offset(offset);

		return NextResponse.json({ data: userComments });
	} catch (error) {
		console.error(`Failed to fetch comments for ${handle}:`, error);
		return NextResponse.json(
			{ error: "Failed to fetch user comments" },
			{ status: 500 },
		);
	}
}
