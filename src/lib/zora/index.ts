import { setApiKey } from "@zoralabs/coins-sdk";

import { env } from "@/env";

// For hackathon/testnet: expose API key to both client and server for higher rate limits
// In production/mainnet: REMOVE NEXT_PUBLIC_ZORA_API_KEY and only set API key in server code
setApiKey(env.NEXT_PUBLIC_ZORA_API_KEY);
