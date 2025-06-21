"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia, zora, zoraSepolia } from "viem/chains";
import { http } from "wagmi";
import { env } from "@/env";

// Create wagmi config with Zora Coins supported networks
const config = createConfig({
	chains: [base, baseSepolia, zora, zoraSepolia], // Base + Zora networks (Zora Coins supported)
	transports: {
		[base.id]: http(),
		[baseSepolia.id]: http(),
		[zora.id]: http(),
		[zoraSepolia.id]: http(),
	},
});

// Create query client as Privy docs specify
const queryClient = new QueryClient();

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
				embeddedWallets: {
					ethereum: {
						createOnLogin: "users-without-wallets",
					},
				},
				// Configure chains for Zora Coins compatibility
				defaultChain: base, // Base mainnet as default (most popular)
				supportedChains: [base, baseSepolia, zora, zoraSepolia], // Full Zora ecosystem support
			}}
		>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={config}>{children}</WagmiProvider>
			</QueryClientProvider>
		</PrivyProvider>
	);
}
