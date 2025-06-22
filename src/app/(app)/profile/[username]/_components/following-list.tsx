"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useFollowing } from "@/hooks/use-following";
import { useProfile } from "@/hooks/use-profile";
import { formatAddress } from "@/lib/utils";

function FollowingUser({ address }: { address: string }) {
	const { data: profile, isLoading } = useProfile(address);

	if (isLoading) {
		return <div className="h-10 w-full animate-pulse rounded-md bg-muted" />;
	}

	if (!profile) {
		return null;
	}

	return (
		<Link href={`/profile/${profile.handle || profile.publicWallet.address}`}>
			<div className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
				<UserAvatar src={profile.avatar?.medium} alt={profile.displayName || "User"} size="sm" />
				<div>
					<p className="font-semibold">{profile.displayName}</p>
					<p className="text-muted-foreground text-sm">
						@{profile.handle || formatAddress(profile.publicWallet.address)}
					</p>
				</div>
			</div>
		</Link>
	);
}

export function FollowingList({ address }: { address: string }) {
	const { data: following, isLoading, isError } = useFollowing(address);

	if (isLoading) return <div className="p-4">Loading...</div>;

	if (isError) {
		return <div className="p-4 text-destructive">Failed to load following list.</div>;
	}

	if (!following || following.length === 0) {
		return <div className="p-4">Not following anyone yet.</div>;
	}

	return (
		<div className="space-y-2 p-4">
			{following.map((followedAddress) => (
				<FollowingUser key={followedAddress} address={followedAddress} />
			))}
		</div>
	);
}
