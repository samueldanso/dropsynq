import { PrivyClient } from "@privy-io/server-auth";
import { env } from "@/env";

export const privyClient = new PrivyClient(env.NEXT_PUBLIC_PRIVY_APP_ID, env.PRIVY_APP_SECRET);

export async function getAuth(req: Request) {
	const authorization = req.headers.get("Authorization");
	if (!authorization) return null;

	const accessToken = authorization.replace("Bearer ", "");

	try {
		const claims = await privyClient.verifyAuthToken(accessToken);
		return claims;
	} catch (error) {
		console.error("Failed to verify auth token:", error);
		return null;
	}
}
