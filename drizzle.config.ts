import type { Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/lib/db/schemas/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
