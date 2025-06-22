export interface Follow {
	id: string;
	follower_address: string; // Zora wallet address
	followee_address: string; // Zora wallet address
	created_at: string;
}

export interface NewFollow extends Omit<Follow, "id" | "created_at"> {}
