import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
	id: uuid("id").defaultRandom().primaryKey(),
	user_address: text("user_address").notNull(), // Zora wallet address
	coin_address: text("coin_address").notNull(), // Zora coin address
	comment_text: text("comment_text").notNull(),
	created_at: timestamp("created_at").defaultNow(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
