"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { env } from "@/env";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<PrivyProvider
			appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
			config={{
				appearance: {
					theme: "dark",
					accentColor: "#676FFF",
					logo: "https://synqbase.xyz/logo.png",
				},
				// Create embedded wallets for users who don't have a wallet
				embeddedWallets: {
					ethereum: {
						createOnLogin: "users-without-wallets",
					},
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
