import {
	createCoin,
	validateMetadataJSON,
	validateMetadataURIContent,
} from "@zoralabs/coins-sdk";
import { type NextRequest, NextResponse } from "next/server";
import {
	type Address,
	createPublicClient,
	createWalletClient,
	http,
} from "viem";
import { base } from "viem/chains";
import { z } from "zod";
import { env } from "@/env";
import { db } from "@/lib/db";
import { tracks } from "@/lib/db/schemas";
import { uploadFileToIPFS } from "@/lib/pinata";
import { verifyPrivyAuth } from "@/lib/privy";

// Simple validation schema
const createTrackSchema = z.object({
	name: z.string().min(1).max(100),
	symbol: z.string().min(1).max(10),
	description: z.string().min(1).max(1000),
	audioFile: z.string(), // Base64 encoded
	coverImage: z.string().optional(), // Base64 encoded
});

export async function POST(request: NextRequest) {
	try {
		// Check if it's a simple file upload (existing functionality)
		const contentType = request.headers.get("content-type");

		if (contentType?.includes("multipart/form-data")) {
			// Handle simple file upload (existing functionality)
			const data = await request.formData();
			const file: File | null = data.get("file") as unknown as File;
			if (!file) {
				return NextResponse.json(
					{ error: "No file provided" },
					{ status: 400 },
				);
			}
			const { cid } = await uploadFileToIPFS(file);
			const url = `${env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
			return NextResponse.json(url, { status: 200 });
		}

		// Handle track creation with Zora
		const authResult = await verifyPrivyAuth(request);
		if (!authResult.success || !authResult.walletAddress) {
			return NextResponse.json(
				{ error: "Unauthorized or no wallet address found" },
				{ status: 401 },
			);
		}

		const { walletAddress } = authResult;
		const body = await request.json();
		const validatedData = createTrackSchema.parse(body);

		// Upload audio file
		const audioBuffer = Buffer.from(validatedData.audioFile, "base64");
		const audioFile = new File([new Blob([audioBuffer])], "track.mp3", {
			type: "audio/mpeg",
		});
		const {
			cid: audioCid,
			success: audioSuccess,
			error: audioError,
		} = await uploadFileToIPFS(audioFile);
		if (!audioSuccess || !audioCid) {
			return NextResponse.json(
				{ error: `Audio upload failed: ${audioError}` },
				{ status: 500 },
			);
		}

		// Upload cover image if provided
		let coverCid: string | undefined;
		if (validatedData.coverImage) {
			const imageBuffer = Buffer.from(validatedData.coverImage, "base64");
			const imageFile = new File([new Blob([imageBuffer])], "cover.jpg", {
				type: "image/jpeg",
			});
			const { cid, success, error } = await uploadFileToIPFS(imageFile);
			if (!success || !cid) {
				console.warn(`Cover image upload failed: ${error}`);
			} else {
				coverCid = cid;
			}
		}

		// Create metadata following Zora's EIP-7572 standard
		const metadata = {
			name: validatedData.name,
			description: validatedData.description,
			// Use cover image as main image if provided, otherwise use a default
			image: coverCid
				? `ipfs://${coverCid}`
				: "ipfs://bafkreifch6stfh3fn3nqv5tpxnknjpo7zulqav55f2b5pryadx6hldldwe", // Default placeholder
			// For audio files, use animation_url and content object
			animation_url: `ipfs://${audioCid}`,
			content: {
				mime: "audio/mpeg",
				uri: `ipfs://${audioCid}`,
			},
			properties: {
				category: "music",
				creator: walletAddress,
			},
		};

		// Validate metadata using Zora's validator
		validateMetadataJSON(metadata);

		// Upload metadata
		const metadataFile = new File(
			[new Blob([JSON.stringify(metadata, null, 2)])],
			"metadata.json",
			{ type: "application/json" },
		);
		const {
			cid: metadataCid,
			success: metadataSuccess,
			error: metadataError,
		} = await uploadFileToIPFS(metadataFile);
		if (!metadataSuccess || !metadataCid) {
			return NextResponse.json(
				{ error: `Metadata upload failed: ${metadataError}` },
				{ status: 500 },
			);
		}

		// Validate metadata URI using Zora's validator
		await validateMetadataURIContent(`ipfs://${metadataCid}`);

		// Create Zora coin (following official docs exactly)
		const publicClient = createPublicClient({
			chain: base,
			transport: http(),
		});

		const walletClient = createWalletClient({
			account: walletAddress as Address,
			chain: base,
			transport: http(),
		});

		const coinParams = {
			name: validatedData.name,
			symbol: validatedData.symbol,
			uri: `ipfs://${metadataCid}`,
			payoutRecipient: walletAddress as Address,
			chainId: base.id,
		};

		const coinResult = await createCoin(coinParams, walletClient, publicClient);

		if (!coinResult.address) {
			return NextResponse.json(
				{ error: "Coin creation succeeded but returned no address." },
				{ status: 500 },
			);
		}

		const trackRecord = await db
			.insert(tracks)
			.values({
				coin_address: coinResult.address,
				creator_address: walletAddress,
				audio_ipfs_hash: audioCid,
				metadata_ipfs_hash: metadataCid,
			})
			.returning();

		return NextResponse.json({
			success: true,
			track: trackRecord[0],
			coin: {
				address: coinResult.address,
				hash: coinResult.hash,
			},
		});
	} catch (error) {
		console.error("Error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
