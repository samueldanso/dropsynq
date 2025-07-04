import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { follows } from "@/lib/db/schemas";
import { getAuth, privyClient } from "@/lib/privy";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
) {
	const { username } = await params;
	const followerAddress = username;

	if (!followerAddress) {
		return NextResponse.json(
			{ error: "Follower address is required" },
			{ status: 400 },
		);
	}

	try {
		const followingList = await db
			.select({
				followee_address: follows.followee_address,
			})
			.from(follows)
			.where(eq(follows.follower_address, followerAddress));

		const addresses = followingList.map((f) => f.followee_address);

		return NextResponse.json({ data: addresses });
	} catch (error) {
		console.error("Error fetching following list:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
) {
	const claims = await getAuth(request);
	if (!claims) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { username } = await params;
	const followeeAddress = username; // The user being followed

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
		const followerAddress = embeddedWallet.address; // The user performing the action

		// Check if the follow relationship already exists
		const existingFollow = await db
			.select()
			.from(follows)
			.where(
				and(
					eq(follows.follower_address, followerAddress),
					eq(follows.followee_address, followeeAddress),
				),
			)
			.limit(1);

		if (existingFollow.length > 0) {
			// If it exists, unfollow (delete the record)
			await db
				.delete(follows)
				.where(
					and(
						eq(follows.follower_address, followerAddress),
						eq(follows.followee_address, followeeAddress),
					),
				);
			return NextResponse.json({ data: { status: "unfollowed" } });
		} else {
			// If it doesn't exist, follow (insert a new record)
			await db.insert(follows).values({
				follower_address: followerAddress,
				followee_address: followeeAddress,
			});
			return NextResponse.json({ data: { status: "followed" } });
		}
	} catch (error) {
		console.error("Error processing follow request:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
