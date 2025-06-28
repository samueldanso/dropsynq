import type { ZoraCoin } from "@/types/zora";

// Music-specific track metadata (stored in IPFS)
export interface TrackMetadata {
	name: string;
	symbol: string;
	description: string;
	audio_ipfs_hash: string;
	cover_image_ipfs_hash?: string;
	genre?: string;
	duration?: number;
	release_date?: string;
	artist_bio?: string;
}

// Database track record (minimal - only music-specific data)
export interface Track {
	id: string;
	coin_address: string; // Zora coin address
	creator_address: string; // Artist wallet
	audio_ipfs_hash: string;
	metadata_ipfs_hash: string;
	created_at: string;
}

// Complete track with Zora coin data
export interface TrackWithCoin extends Track {
	coin?: ZoraCoin;
}
