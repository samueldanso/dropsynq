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
import { privateKeyToAccount } from "viem/accounts";

export interface CreateSongCoinParams {
  name: string;
  symbol: string;
  uri: string; // IPFS metadata URI
  payoutRecipient: Address;
  platformReferrer?: Address;
}

export async function createSongCoin(params: CreateSongCoinParams) {
  try {
    // 1. Create an account from the private key
    const account = privateKeyToAccount(
      env.WALLET_PRIVATE_KEY as `0x${string}`
    );

    // 2. Create clients with the derived account
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(),
    });
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    // 3. Prepare the coin creation parameters
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

    // 4. Call the SDK function
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
