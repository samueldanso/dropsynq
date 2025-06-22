export interface Coin {
	id: string;
	name: string;
	symbol: string;
	address: string;
	chainId: number;
	totalSupply: string;
	volume24h: string;
	createdAt: string;
	uniqueHolders: number;
	description?: string;
	media?: {
		previewImage?: string;
		medium?: string;
		blurhash?: string;
	};
}

export interface CoinBalance {
	id: string;
	amount: {
		amountRaw: string;
		amountDecimal: number;
	};
	coin?: Coin;
	timestamp?: string;
}
