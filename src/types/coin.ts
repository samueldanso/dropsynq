// Zora Coin data structure (matches Zora API response)
export interface ZoraCoin {
	id: string;
	name: string;
	symbol: string;
	description: string;
	address: string;
	totalSupply: string;
	volume24h: string;
	createdAt?: string;
	creatorAddress?: string;
	marketCap: string;
	chainId: number;
	tokenUri?: string;
	uniqueHolders: number;
	mediaContent?: {
		mimeType?: string;
		originalUri: string;
		previewImage?: {
			small: string;
			medium: string;
			blurhash?: string;
		};
	};
	creatorProfile?: {
		id: string;
		handle: string;
		avatar?: {
			previewImage: {
				blurhash?: string;
				medium: string;
				small: string;
			};
		};
	};
}

// Coin balance for user holdings
export interface CoinBalance {
	id: string;
	amount: {
		amountRaw: string;
		amountDecimal: number;
	};
	coin?: ZoraCoin;
	timestamp?: string;
}
