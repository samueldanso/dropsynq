"use client";

import { Music, UserPlus, Users } from "lucide-react";
import { useAccount } from "wagmi";
import { FollowButton } from "@/components/shared/follow-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useProfileBalances } from "@/hooks/use-profile-balances";
import { formatAddress } from "@/lib/utils";
import type { ZoraProfile } from "@/types/profile";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
	profile: ZoraProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
	const { address: connectedAddress } = useAccount();
	const { data: balances, isLoading: isLoadingBalances } = useProfileBalances(
		profile.publicWallet.address || "",
	);

	if (!profile) return null;

	const isOwnProfile = connectedAddress === profile.publicWallet.address;

	const displayName = profile.displayName || "Anonymous";
	const dropsCount = balances?.length || 0;
	// TODO: Replace with actual data from off-chain DB once available.
	const followingCount = 0;
	const followersCount = 0;

	return (
		<div className="flex w-full flex-col items-center justify-center gap-6 border-b pb-8">
			{/* Profile Avatar */}
			<UserAvatar src={profile.avatar?.medium} alt={displayName} size="xl" />

			{/* Profile Info - Centered */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="font-bold text-2xl">{displayName}</h1>
				{profile.publicWallet.address && (
					<p className="text-muted-foreground">
						@{profile.handle || formatAddress(profile.publicWallet.address)}
					</p>
				)}
				{profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
			</div>

			{/* Stats - Centered with icons */}
			<div className="flex items-center gap-8 font-medium text-muted-foreground">
				<div className="flex flex-col items-center">
					<span className="font-semibold text-foreground text-xl">
						{isLoadingBalances ? "..." : dropsCount}
					</span>
					<div className="flex items-center gap-1 text-sm">
						<Music className="size-3" />
						<span>Drops</span>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<span className="font-semibold text-foreground text-xl">
						{followingCount}
					</span>
					<div className="flex items-center gap-1 text-sm">
						<UserPlus className="size-3" />
						<span>Following</span>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<span className="font-semibold text-foreground text-xl">
						{followersCount}
					</span>
					<div className="flex items-center gap-1 text-sm">
						<Users className="size-3" />
						<span>Followers</span>
					</div>
				</div>
			</div>

			{/* Action Button - Centered */}
			<div className="flex w-full justify-center">
				{isOwnProfile ? (
					<EditProfileDialog profile={profile} />
				) : (
					profile.publicWallet.address && (
						<FollowButton userId={profile.publicWallet.address} />
					)
				)}
			</div>
		</div>
	);
}
