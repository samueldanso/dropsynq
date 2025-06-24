"server only";

import { PinataSDK } from "pinata";

import { env } from "@/env";

export const pinata = new PinataSDK({
	pinataJwt: `${env.PINATA_JWT}`,
	pinataGateway: `${env.NEXT_PUBLIC_GATEWAY_URL}`,
});

export interface UploadResult {
	success: boolean;
	cid?: string;
	error?: string;
}

/**
 * Uploads a file to IPFS using Pinata.
 * This follows the official Pinata SDK example for Next.js server-side uploads.
 * @see https://docs.pinata.cloud/frameworks/next-js
 * @param file The file to upload.
 * @returns An object with the upload status and IPFS hash (CID).
 */
export async function uploadFileToIPFS(file: File): Promise<UploadResult> {
	try {
		const result = await pinata.upload.public.file(file);
		return {
			success: true,
			cid: result.cid,
		};
	} catch (error) {
		console.error("Failed to upload to IPFS:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Upload failed",
		};
	}
}
