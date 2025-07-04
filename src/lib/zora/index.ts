import "server-only";
import { setApiKey } from "@zoralabs/coins-sdk";

import { env } from "@/env";

// Set up your API key before making any SDK requests
setApiKey(env.ZORA_API_KEY);
