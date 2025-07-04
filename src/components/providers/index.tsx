"use client";

import "@/lib/zora";
import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia } from "viem/chains";
import { http } from "wagmi";
import { env } from "@/env";

const config = createConfig({
	chains: [base, baseSepolia],
	transports: {
		[base.id]: http(),
		[baseSepolia.id]: http(),
	},
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<PrivyProvider
			appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
			config={{
				appearance: {
					theme: "dark",
					logo: "https://dropsynq.xyz/logo.png",
				},
				embeddedWallets: {
					ethereum: {
						createOnLogin: "users-without-wallets",
					},
				},
				defaultChain: baseSepolia,
				supportedChains: [base, baseSepolia],
			}}
		>
			<QueryClientProvider client={queryClient}>
				<WagmiProvider config={config}>{children}</WagmiProvider>
			</QueryClientProvider>
		</PrivyProvider>
	);
}
