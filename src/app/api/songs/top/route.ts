import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes } from "@/lib/db/schemas/likes";
import { tracks } from "@/lib/db/schemas/tracks";

export async function GET() {
	const top = await db
		.select({
			id: tracks.id,
			name: tracks.name,
			description: tracks.description,
			image_url: tracks.image_url,
			audio_url: tracks.audio_url,
			metadata_url: tracks.metadata_url,
			coin_address: tracks.coin_address,
			creator_address: tracks.creator_address,
			created_at: tracks.created_at,
			like_count: sql`COUNT(${likes.id})`.as("like_count"),
		})
		.from(tracks)
		.leftJoin(likes, sql`${likes.coin_address} = ${tracks.coin_address}`)
		.groupBy(
			tracks.id,
			tracks.name,
			tracks.description,
			tracks.image_url,
			tracks.audio_url,
			tracks.metadata_url,
			tracks.coin_address,
			tracks.creator_address,
			tracks.created_at,
		)
		.orderBy(sql`like_count DESC`, desc(tracks.created_at))
		.limit(20);
	return NextResponse.json(top);
}
