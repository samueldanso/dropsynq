export interface Comment {
	id: string;
	user_address: string; // Zora wallet address
	coin_address: string; // Zora coin address
	comment_text: string;
	created_at: string;
}

export interface NewComment extends Omit<Comment, "id" | "created_at"> {}
