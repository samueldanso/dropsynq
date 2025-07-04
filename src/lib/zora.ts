import { setApiKey } from "@zoralabs/coins-sdk";

import { env } from "@/env";

const apiKey =
	typeof window === "undefined"
		? env.ZORA_API_KEY
		: env.NEXT_PUBLIC_ZORA_API_KEY;
setApiKey(apiKey);
