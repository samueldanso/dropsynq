import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/db/schemas/tracks";

export async function POST(request: NextRequest) {
	try {
		const data = await request.json();
		const {
			name,
			description,
			image_url,
			audio_url,
			metadata_url,
			coin_address,
			creator_address,
		} = data;

		if (!name || !coin_address || !creator_address) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		await db.insert(tracks).values({
			name,
			description,
			image_url,
			audio_url,
			metadata_url,
			coin_address,
			creator_address,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving song coin to DB:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
