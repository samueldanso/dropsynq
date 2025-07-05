"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoinsTopGainers, getProfile } from "@zoralabs/coins-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ZoraProfile {
	handle: string;
	avatar?: { medium: string };
	displayName?: string;
	publicWallet: { walletAddress: string };
}

function ArtistCard({ profile }: { profile: ZoraProfile }) {
	const name =
		profile.displayName ||
		profile.handle ||
		profile.publicWallet.walletAddress.slice(0, 8) + "...";
	const href = profile.handle
		? `/profile/${profile.handle}`
		: `/profile/${profile.publicWallet.walletAddress}`;
	return (
		<Link
			href={href}
			className="flex flex-col items-center gap-2 group focus:outline-none"
			tabIndex={0}
			aria-label={`View profile for ${name}`}
		>
			{profile.avatar?.medium ? (
				<img
					src={profile.avatar.medium}
					alt={name}
					className="size-24 rounded-full object-cover border border-muted group-hover:scale-105 group-focus:scale-105 transition"
				/>
			) : (
				<div className="size-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground group-hover:scale-105 group-focus:scale-105 transition">
					{name[0]}
				</div>
			)}
			<span className="text-base font-medium text-center truncate max-w-[96px]">
				{name}
			</span>
		</Link>
	);
}

export default function ArtistsPage() {
	const [artists, setArtists] = useState<ZoraProfile[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchArtists() {
			setIsLoading(true);
			setError(null);
			try {
				// 1. Fetch trending coins
				const coinsRes = await getCoinsTopGainers({ count: 24 });
				const coins =
					coinsRes?.data?.exploreList?.edges?.map((edge: any) => edge.node) ||
					[];
				// 2. Extract unique creator addresses
				const uniqueAddresses = Array.from(
					new Set(
						coins.map((coin: any) => coin.creatorAddress).filter(Boolean),
					),
				);
				// 3. Fetch each creator's profile (in parallel, but limit concurrency for API)
				const profiles: ZoraProfile[] = [];
				for (const address of uniqueAddresses) {
					try {
						const res = await getProfile({ identifier: address });
						const profile = res?.data?.profile;
						if (
							profile &&
							profile.handle &&
							profile.publicWallet?.walletAddress
						) {
							profiles.push({
								handle: profile.handle,
								avatar: profile.avatar
									? { medium: profile.avatar.medium }
									: undefined,
								displayName: profile.displayName,
								publicWallet: {
									walletAddress: profile.publicWallet.walletAddress,
								},
							});
						}
					} catch (e) {
						// Ignore failed profiles
					}
				}
				setArtists(profiles);
			} catch (err: any) {
				setError(err?.message || "Failed to load artists");
			} finally {
				setIsLoading(false);
			}
		}
		fetchArtists();
	}, []);

	return (
		<div className="max-w-3xl mx-auto py-10">
			<h1 className="text-3xl font-bold mb-8 text-center">Discover Artists</h1>
			{isLoading ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
					{[
						"a1",
						"a2",
						"a3",
						"a4",
						"a5",
						"a6",
						"a7",
						"a8",
						"a9",
						"a10",
						"a11",
						"a12",
					].map((key) => (
						<div key={key} className="flex flex-col items-center gap-2">
							<Skeleton className="size-24 rounded-full" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
			) : error ? (
				<div className="text-center text-red-500">{error}</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
					{artists.map((profile) => (
						<ArtistCard
							key={profile.handle || profile.publicWallet.walletAddress}
							profile={profile}
						/>
					))}
				</div>
			)}
		</div>
	);
}
