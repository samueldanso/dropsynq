"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import {
	getProfile,
	getProfileBalances,
	getProfileCoins,
} from "@zoralabs/coins-sdk";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Loader } from "@/components/ui/loader";
import type { ZoraCoin } from "@/types/zora";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileTabs } from "./_components/profile-tabs";

export default function ProfilePage() {
	const { address } = useAccount();
	const params = useParams();
	const handle = params?.handle as string | undefined;
	const identifier = handle || address || "";

	const profile = useQuery({
		queryKey: ["profile", identifier],
		queryFn: async () => {
			const res = await getProfile({ identifier });
			return res?.data?.profile;
		},
		enabled: !!identifier,
	});

	const balances = useQuery({
		queryKey: ["profile-balances", identifier],
		queryFn: async () => {
			const res = await getProfileBalances({ identifier });
			return (
				res?.data?.profile?.coinBalances?.edges?.map(
					(
						edge: NonNullable<
							GetProfileBalancesResponse["profile"]
						>["coinBalances"]["edges"][0],
					) => edge.node,
				) || []
			);
		},
		enabled: !!identifier,
	});

	const coins = useQuery({
		queryKey: ["profile-coins", identifier],
		queryFn: async () => {
			const res = await getProfileCoins({ identifier });
			return (
				res?.data?.profile?.createdCoins?.edges?.map(
					(edge: { node: ZoraCoin }) => edge.node,
				) || []
			);
		},
		enabled: !!identifier,
	});

	const isLoading = profile.isLoading || balances.isLoading || coins.isLoading;
	const isError = profile.isError || balances.isError || coins.isError;

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (isError || !profile.data) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Profile not found.</p>
			</div>
		);
	}

	// If handle is undefined, we'll use the profile's handle or address as fallback
	const displayHandle =
		handle || profile.data.handle || profile.data.publicWallet?.walletAddress;

	return (
		<div className="container mx-auto py-8">
			<ProfileHeader profile={profile.data} balances={balances.data} />
			<div className="mt-8">
				<ProfileTabs
					handle={displayHandle}
					profile={profile.data}
					balances={balances.data}
					coins={coins.data}
				/>
			</div>
		</div>
	);
}
