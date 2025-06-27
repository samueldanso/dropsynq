ALTER TABLE "tracks" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "audio_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" ADD COLUMN "metadata_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN "audio_ipfs_hash";--> statement-breakpoint
ALTER TABLE "tracks" DROP COLUMN "metadata_ipfs_hash";--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_coin_address_unique" UNIQUE("coin_address");