export interface ZoraProfile {
	address: `0x${string}`;
	handle?: string;
	displayName?: string;
	bio?: string;
	avatar?: {
		url?: string;
		medium?: string;
	};
	publicWallet: {
		address: `0x${string}`;
	};
}
