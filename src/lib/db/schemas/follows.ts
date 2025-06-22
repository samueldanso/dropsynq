import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const follows = pgTable("follows", {
	id: uuid("id").defaultRandom().primaryKey(),
	follower_address: text("follower_address").notNull(), // Zora wallet address
	followee_address: text("followee_address").notNull(), // Zora wallet address
	created_at: timestamp("created_at").defaultNow(),
});

export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;
