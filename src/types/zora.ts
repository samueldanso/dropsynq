// Re-export Zora SDK types for direct use
import type {
	GetCoinResponse,
	GetProfileBalancesResponse,
	GetProfileResponse,
} from "@zoralabs/coins-sdk";

// Coin types
export type ZoraCoin = NonNullable<GetCoinResponse["zora20Token"]>;

// Profile types
export type ZoraProfile = NonNullable<GetProfileResponse["profile"]>;

// Balance types
export type ZoraCoinBalance = NonNullable<
	GetProfileBalancesResponse["profile"]
>["coinBalances"]["edges"][0]["node"];
