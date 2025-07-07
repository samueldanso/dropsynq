import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schemas";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ coinAddress: string }> },
) {
	const { coinAddress } = await params;

	try {
		// Get the total number of likes for this coin
		const likeCount = await db
			.select({ count: likes.id })
			.from(likes)
			.where(eq(likes.coin_address, coinAddress));

		return NextResponse.json({
			data: {
				count: likeCount.length,
			},
		});
	} catch (error) {
		console.error("Error fetching like count:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
