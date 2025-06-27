import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tracks = pgTable("tracks", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	image_url: text("image_url").notNull(),
	audio_url: text("audio_url").notNull(),
	metadata_url: text("metadata_url").notNull(),
	coin_address: text("coin_address").notNull().unique(),
	creator_address: text("creator_address").notNull(),
	created_at: timestamp("created_at").defaultNow(),
});
