import { getProfile } from "@zoralabs/coins-sdk";
import { NextResponse } from "next/server";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ username: string }> },
) {
	try {
		const { username } = await params;
		const response = await getProfile({ identifier: username });
		const profile = response?.data?.profile;

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}
		return NextResponse.json(profile);
	} catch (error) {
		console.error("Failed to fetch Zora profile:", error);
		return NextResponse.json(
			{ error: "Failed to fetch profile data" },
			{ status: 500 },
		);
	}
}
