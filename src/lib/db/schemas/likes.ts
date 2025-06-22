import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const likes = pgTable("likes", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_address: text("user_address").notNull(), // Zora wallet address
	coin_address: text("coin_address").notNull(), // Zora coin address
	created_at: timestamp("created_at").defaultNow(),
});

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
