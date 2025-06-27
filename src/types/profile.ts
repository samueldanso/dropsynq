export interface ZoraProfile {
	address: `0x${string}`;
	handle?: string;
	username?: string;
	displayName?: string;
	bio?: string;
	avatar?: {
		small: string;
		medium: string;
		blurhash?: string;
	};
	publicWallet: {
		walletAddress: string;
	};
}
