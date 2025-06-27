"server only";

import { createCoin, DeployCurrency } from "@zoralabs/coins-sdk";
import {
	type Address,
	createPublicClient,
	createWalletClient,
	http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { env } from "@/env";

export interface CreateSongCoinParams {
	name: string;
	symbol: string;
	uri: string; // IPFS metadata URI
	payoutRecipient: Address;
	platformReferrer?: Address;
}

export async function createSongCoin(params: CreateSongCoinParams) {
	try {
		// 1. Ensure the private key is correctly formatted with a '0x' prefix
		const privateKey = (
			env.WALLET_PRIVATE_KEY.startsWith("0x")
				? env.WALLET_PRIVATE_KEY
				: `0x${env.WALLET_PRIVATE_KEY}`
		) as `0x${string}`;

		// 2. Create an account from the formatted private key
		const account = privateKeyToAccount(privateKey);

		// 3. Create clients with the derived account
		const walletClient = createWalletClient({
			account,
			chain: baseSepolia,
			transport: http(),
		});
		const publicClient = createPublicClient({
			chain: baseSepolia,
			transport: http(),
		});

		// 4. Prepare the coin creation parameters
		const coinParams = {
			name: params.name,
			symbol: params.symbol,
			uri: params.uri,
			payoutRecipient: params.payoutRecipient,
			platformReferrer:
				params.platformReferrer ||
				("0x0000000000000000000000000000000000000000" as Address),
			chainId: baseSepolia.id,
			currency: DeployCurrency.ETH, // Use ETH on Base Sepolia testnet
		};

		// 5. Call the SDK function
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
