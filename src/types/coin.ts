export interface Coin {
	id: string;
	name: string;
	symbol: string;
	address: string;
	owner: string;
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
	balance: string;
	coin?: Coin;
	timestamp?: string;
}
