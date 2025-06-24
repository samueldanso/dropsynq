"server only";

import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import {
	type Address,
	createPublicClient,
	createWalletClient,
	http,
} from "viem";
import { base } from "viem/chains";
import { env } from "@/env";

// Set up viem clients for server-side coin creation
const publicClient = createPublicClient({
	chain: base,
	transport: http(), // Uses default base RPC URL
});

const walletClient = createWalletClient({
	account: env.WALLET_PRIVATE_KEY as `0x${string}`,
	chain: base,
	transport: http(), // Uses default base RPC URL
});

export interface CreateSongCoinParams {
	name: string;
	symbol: string;
	uri: string; // IPFS metadata URI
	payoutRecipient: Address;
	platformReferrer?: Address;
}

export async function createSongCoin(params: CreateSongCoinParams) {
	try {
		const coinParams = {
			name: params.name,
			symbol: params.symbol,
			uri: params.uri,
			payoutRecipient: params.payoutRecipient,
			platformReferrer:
				params.platformReferrer ||
				("0x0000000000000000000000000000000000000000" as Address),
			chainId: base.id,
			currency: DeployCurrency.ZORA, // Use ZORA on Base mainnet
		};

		const result = await createCoin(coinParams, walletClient, publicClient, {
			gasMultiplier: 120, // Add 20% buffer to gas
		});

		return {
			success: true,
			hash: result.hash,
			address: result.address,
			deployment: result.deployment,
		};
	} catch (error) {
		console.error("Error creating song coin:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to create coin",
		};
	}
}
