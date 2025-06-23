import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tracks = pgTable("tracks", {
	id: uuid("id").defaultRandom().primaryKey(),
	coin_address: text("coin_address").notNull(), // Zora coin address
	creator_address: text("creator_address").notNull(), // Artist wallet address
	audio_ipfs_hash: text("audio_ipfs_hash").notNull(), // Audio file IPFS hash
	metadata_ipfs_hash: text("metadata_ipfs_hash").notNull(), // Track metadata IPFS hash
	created_at: timestamp("created_at").defaultNow(),
});
