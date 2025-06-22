export interface Like {
	id: string;
	user_address: string; // Zora wallet address
	coin_address: string; // Zora coin address
	created_at: string;
}

export interface NewLike extends Omit<Like, "id" | "created_at"> {}
