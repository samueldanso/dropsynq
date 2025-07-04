import { validateMetadataJSON } from "@zoralabs/coins-sdk";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadFileToIPFS } from "@/lib/pinata";

// Form data validation schema - updated for new form structure
const createSongSchema = z.object({
	name: z.string().min(1, "Song name is required"),
	symbol: z
		.string()
		.min(1, "Coin symbol is required")
		.max(11, "Symbol must be 11 characters or less")
		.regex(/^[A-Z0-9]+$/, "Symbol must be uppercase letters and numbers only"),
	description: z.string().min(1, "Description is required"),
	genre: z.string().min(1, "Genre is required"),
});

// This endpoint handles file and metadata upload to IPFS for Zora coin creation
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();

		// Extract form fields
		const name = formData.get("name") as string;
		const symbol = formData.get("symbol") as string;
		const description = formData.get("description") as string;
		const genre = formData.get("genre") as string;

		// Extract files
		const audioFile = formData.get("audioFile") as File;
		const coverImage = formData.get("coverImage") as File;

		// Validate form data
		const validatedData = createSongSchema.parse({
			name,
			symbol,
			description,
			genre,
		});

		if (!audioFile || !coverImage) {
			return NextResponse.json(
				{ error: "Audio file and cover image are required" },
				{ status: 400 },
			);
		}

		// Step 1: Upload audio file to IPFS
		const audioUpload = await uploadFileToIPFS(audioFile);
		if (!audioUpload.success || !audioUpload.cid) {
			return NextResponse.json(
				{ error: "Failed to upload audio file" },
				{ status: 500 },
			);
		}

		// Step 2: Upload cover image to IPFS
		const imageUpload = await uploadFileToIPFS(coverImage);
		if (!imageUpload.success || !imageUpload.cid) {
			return NextResponse.json(
				{ error: "Failed to upload cover image" },
				{ status: 500 },
			);
		}

		// Step 3: Create metadata JSON for Zora coin
		const metadata = {
			name: validatedData.name,
			description: validatedData.description,
			image: `ipfs://${imageUpload.cid}`,
			animation_url: `ipfs://${audioUpload.cid}`,
			content: {
				mime: audioFile.type || "audio/mpeg",
				uri: `ipfs://${audioUpload.cid}`,
			},
			properties: {
				category: "music",
				genre: validatedData.genre,
				symbol: validatedData.symbol,
				// Note: creator will be determined by the connected wallet during coin creation
			},
		};

		// Step 4: Validate metadata
		try {
			validateMetadataJSON(metadata);
		} catch (error) {
			return NextResponse.json(
				{ error: "Invalid metadata format" },
				{ status: 400 },
			);
		}

		// Step 5: Upload metadata to IPFS
		const metadataBlob = new Blob([JSON.stringify(metadata)], {
			type: "application/json",
		});
		const metadataFile = new File([metadataBlob], "metadata.json", {
			type: "application/json",
		});

		const metadataUpload = await uploadFileToIPFS(metadataFile);
		if (!metadataUpload.success || !metadataUpload.cid) {
			return NextResponse.json(
				{ error: "Failed to upload metadata" },
				{ status: 500 },
			);
		}

		// Return only the metadata URI for frontend coin creation
		return NextResponse.json({ metadataUri: `ipfs://${metadataUpload.cid}` });
	} catch (error) {
		console.error("Error uploading song files/metadata:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
