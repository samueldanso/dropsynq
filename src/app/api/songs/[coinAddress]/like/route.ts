import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schemas";
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

		// Check if the like already exists
		const existingLike = await db
			.select()
			.from(likes)
			.where(
				and(
					eq(likes.user_address, userAddress),
					eq(likes.coin_address, coinAddress),
				),
			)
			.limit(1);

		if (existingLike.length > 0) {
			return NextResponse.json(
				{ error: "Song already liked" },
				{ status: 400 },
			);
		}

		// Create the like
		await db.insert(likes).values({
			user_address: userAddress,
			coin_address: coinAddress,
		});

		return NextResponse.json({ data: { status: "liked" } });
	} catch (error) {
		console.error("Error processing like request:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ coinAddress: string }> },
) {
	const claims = await getAuth(request);
	if (!claims) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { coinAddress } = await params;

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

		// Delete the like
		await db
			.delete(likes)
			.where(
				and(
					eq(likes.user_address, userAddress),
					eq(likes.coin_address, coinAddress),
				),
			);

		return NextResponse.json({ data: { status: "unliked" } });
	} catch (error) {
		console.error("Error processing unlike request:", error);
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
	const userAddress = searchParams.get("user");

	if (!userAddress) {
		return NextResponse.json(
			{ error: "User address is required" },
			{ status: 400 },
		);
	}

	try {
		// Check if the user has liked this song
		const existingLike = await db
			.select()
			.from(likes)
			.where(
				and(
					eq(likes.user_address, userAddress),
					eq(likes.coin_address, coinAddress),
				),
			)
			.limit(1);

		return NextResponse.json({
			data: {
				isLiked: existingLike.length > 0,
			},
		});
	} catch (error) {
		console.error("Error checking like status:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
