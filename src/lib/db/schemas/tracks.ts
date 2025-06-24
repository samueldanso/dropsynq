import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const tracks = pgTable("tracks", {
  id: uuid("id").defaultRandom().primaryKey(),
  coin_address: text("coin_address").notNull(),
  creator_address: text("creator_address").notNull(),
  audio_ipfs_hash: text("audio_ipfs_hash").notNull(),
  metadata_ipfs_hash: text("metadata_ipfs_hash").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
