"use client";

import type { GetProfileBalancesResponse } from "@zoralabs/coins-sdk";
import { useAccount } from "wagmi";
import { FollowButton } from "@/components/shared/follow-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFollowCounts } from "@/hooks/use-social";
import type { ZoraProfile } from "@/types/zora";

type CoinBalanceNode = NonNullable<
	GetProfileBalancesResponse["profile"]
>["coinBalances"]["edges"][0]["node"];

interface ProfileHeaderProps {
	profile: ZoraProfile;
	balances?: CoinBalanceNode[];
}

export function ProfileHeader({ profile, balances }: ProfileHeaderProps) {
	const { address: connectedAddress } = useAccount();
	const { followers: followersCount, following: followingCount } =
		useFollowCounts({
			handle: profile.handle || profile.publicWallet?.walletAddress || "",
		});

	if (!profile) return <div>User not found.</div>;

	const isOwnProfile =
		connectedAddress &&
		profile.publicWallet?.walletAddress &&
		connectedAddress.toLowerCase() ===
			profile.publicWallet.walletAddress.toLowerCase();
	const displayName = profile.displayName || "Anonymous";
	const dropsCount = balances?.length || 0;

	return (
		<div className="flex w-full flex-col items-center justify-center gap-6 pb-8">
			{/* Profile Avatar */}
			<UserAvatar src={profile.avatar?.medium} alt={displayName} size="xl" />

			{/* Profile Info - Centered */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="font-bold text-2xl">{displayName}</h1>
				{profile?.handle && (
					<span className="text-muted-foreground">@{profile.handle}</span>
				)}
				{profile?.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
			</div>

			{/* Stats - Centered */}
			<div className="flex items-center gap-8 font-medium text-muted-foreground">
				<div className="flex flex-col items-center">
					<span className="font-semibold text-foreground text-xl">
						{dropsCount}
					</span>
					<div className="flex items-center gap-1 text-sm">
						<span>Drops</span>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<span className="font-semibold text-foreground text-xl">
						{followingCount}
					</span>
					<div className="flex items-center gap-1 text-sm">
						<span>Following</span>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<span className="font-semibold text-foreground text-xl">
						{followersCount}
					</span>
					<div className="flex items-center gap-1 text-sm">
						<span>Followers</span>
					</div>
				</div>
			</div>

			{/* Action Button - Centered */}
			<div className="flex w-full justify-center">
				{isOwnProfile ? (
					<a
						href={`https://zora.co/${
							profile.handle
								? `@${profile.handle}`
								: profile.publicWallet?.walletAddress
						}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button
							type="button"
							className="rounded-full px-8 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
						>
							Edit on Zora
						</button>
					</a>
				) : (
					profile.publicWallet?.walletAddress && (
						<FollowButton userId={profile.publicWallet.walletAddress} />
					)
				)}
			</div>
		</div>
	);
}

export function ProfileHeaderSkeleton() {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-6 border-b pb-8">
			<Skeleton className="size-24 rounded-full" />
			<div className="flex flex-col items-center gap-2 text-center">
				<Skeleton className="h-8 w-40" />
				<Skeleton className="h-5 w-32" />
				<Skeleton className="mt-2 h-4 w-64" />
			</div>
			<div className="flex items-center gap-8">
				<div className="flex flex-col items-center gap-1">
					<Skeleton className="h-6 w-10" />
					<Skeleton className="h-4 w-12" />
				</div>
				<div className="flex flex-col items-center gap-1">
					<Skeleton className="h-6 w-10" />
					<Skeleton className="h-4 w-16" />
				</div>
				<div className="flex flex-col items-center gap-1">
					<Skeleton className="h-6 w-10" />
					<Skeleton className="h-4 w-16" />
				</div>
			</div>
			<Skeleton className="h-10 w-24" />
		</div>
	);
}
