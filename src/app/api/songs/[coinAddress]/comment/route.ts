import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments } from "@/lib/db/schemas";
import { getAuth, privyClient } from "@/lib/privy";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ coinAddress: string }> },
) {
	const claims = await getAuth(request);
	if (!claims) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { coinAddress } = await params;
	const { comment_text } = await request.json();

	if (!comment_text || comment_text.trim().length === 0) {
		return NextResponse.json(
			{ error: "Comment text is required" },
			{ status: 400 },
		);
	}

	try {
		const user = await privyClient.getUser(claims.userId);
		const embeddedWallet = user.linkedAccounts.find(
			(account) =>
				account.type === "wallet" && account.walletClientType === "privy",
		);

		if (!embeddedWallet || embeddedWallet.type !== "wallet") {
			return NextResponse.json(
				{ error: "User does not have an embedded wallet" },
				{ status: 400 },
			);
		}
		const userAddress = embeddedWallet.address;

		// Create the comment
		const [newComment] = await db
			.insert(comments)
			.values({
				user_address: userAddress,
				coin_address: coinAddress,
				comment_text: comment_text.trim(),
			})
			.returning();

		return NextResponse.json({ data: newComment });
	} catch (error) {
		console.error("Error creating comment:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ coinAddress: string }> },
) {
	const { coinAddress } = await params;
	const { searchParams } = new URL(request.url);
	const limit = parseInt(searchParams.get("limit") || "20");
	const offset = parseInt(searchParams.get("offset") || "0");

	try {
		// Get comments for this song, ordered by newest first
		const songComments = await db
			.select()
			.from(comments)
			.where(eq(comments.coin_address, coinAddress))
			.orderBy(desc(comments.created_at))
			.limit(limit)
			.offset(offset);

		return NextResponse.json({ data: songComments });
	} catch (error) {
		console.error("Error fetching comments:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
