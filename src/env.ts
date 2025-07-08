import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		SUPABASE_SERVICE_KEY: z.string(),
		PINATA_JWT: z.string(),
		ZORA_API_KEY: z.string(),
		PRIVY_APP_SECRET: z.string(),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
		NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
		NEXT_PUBLIC_SUPABASE_URL: z.string(),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
		NEXT_PUBLIC_GATEWAY_URL: z.string(),
		NEXT_PUBLIC_ZORA_API_KEY: z.string().min(1),
	},

	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
		PINATA_JWT: process.env.PINATA_JWT,
		ZORA_API_KEY: process.env.ZORA_API_KEY,
		PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
		NEXT_PUBLIC_ZORA_API_KEY: process.env.NEXT_PUBLIC_ZORA_API_KEY,
	},
});
