import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/db/schemas/tracks";

export async function GET() {
	const recent = await db
		.select()
		.from(tracks)
		.orderBy(desc(tracks.created_at))
		.limit(20);
	return NextResponse.json(recent);
}
