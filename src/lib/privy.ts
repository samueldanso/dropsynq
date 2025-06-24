import { PrivyClient } from "@privy-io/server-auth";
import { env } from "@/env";

export const privyClient = new PrivyClient(
	env.NEXT_PUBLIC_PRIVY_APP_ID,
	env.PRIVY_APP_SECRET,
);

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

export interface AuthResult {
	success: boolean;
	userId?: string;
	walletAddress?: string;
	error?: string;
}

export async function verifyPrivyAuth(req: Request): Promise<AuthResult> {
	try {
		const claims = await getAuth(req);

		if (!claims) {
			return {
				success: false,
				error: "No valid authorization token",
			};
		}

		// Get user data and find embedded wallet (following existing pattern)
		const user = await privyClient.getUser(claims.userId);
		const embeddedWallet = user.linkedAccounts.find(
			(account) =>
				account.type === "wallet" && account.walletClientType === "privy",
		);

		if (!embeddedWallet || embeddedWallet.type !== "wallet") {
			return {
				success: false,
				error: "User does not have an embedded wallet",
			};
		}

		const walletAddress = embeddedWallet.address;

		return {
			success: true,
			userId: claims.userId,
			walletAddress,
		};
	} catch (error) {
		console.error("Failed to verify Privy auth:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Authentication failed",
		};
	}
}
