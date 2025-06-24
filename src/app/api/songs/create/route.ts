import { validateMetadataJSON } from "@zoralabs/coins-sdk";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadFileToIPFS } from "@/lib/pinata";
import { createSongCoin } from "@/lib/zora/create-coin";

// Form data validation schema - minimal required fields
const createSongSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  creator: z.string().min(1, "Creator is required"),
  genre: z.string().min(1, "Genre is required"),
  payoutRecipient: z.string().min(42, "Valid wallet address required"),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const creator = formData.get("creator") as string;
    const genre = formData.get("genre") as string;
    const payoutRecipient = formData.get("payoutRecipient") as string;

    // Extract files
    const audioFile = formData.get("audioFile") as File;
    const coverImage = formData.get("coverImage") as File;

    // Validate form data
    const validatedData = createSongSchema.parse({
      name,
      description,
      creator,
      genre,
      payoutRecipient,
    });

    if (!audioFile || !coverImage) {
      return NextResponse.json(
        { error: "Audio file and cover image are required" },
        { status: 400 }
      );
    }

    // Step 1: Upload audio file to IPFS
    const audioUpload = await uploadFileToIPFS(audioFile);
    if (!audioUpload.success || !audioUpload.cid) {
      return NextResponse.json(
        { error: "Failed to upload audio file" },
        { status: 500 }
      );
    }

    // Step 2: Upload cover image to IPFS
    const imageUpload = await uploadFileToIPFS(coverImage);
    if (!imageUpload.success || !imageUpload.cid) {
      return NextResponse.json(
        { error: "Failed to upload cover image" },
        { status: 500 }
      );
    }

    // Step 3: Create metadata JSON
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
        creator: validatedData.creator,
      },
    };

    // Step 4: Validate metadata
    try {
      validateMetadataJSON(metadata);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid metadata format" },
        { status: 400 }
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
        { status: 500 }
      );
    }

    // Step 6: Create coin using Zora SDK
    const coinResult = await createSongCoin({
      name: validatedData.name,
      symbol: validatedData.name.substring(0, 3).toUpperCase(), // Simple symbol generation
      uri: `ipfs://${metadataUpload.cid}`,
      payoutRecipient: validatedData.payoutRecipient as `0x${string}`,
    });

    if (!coinResult.success) {
      return NextResponse.json({ error: coinResult.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      coinAddress: coinResult.address,
      transactionHash: coinResult.hash,
      metadataUri: `ipfs://${metadataUpload.cid}`,
    });
  } catch (error) {
    console.error("Error creating song coin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
