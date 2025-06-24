"use client";

import { Music, UserPlus, Users } from "lucide-react";
import { useAccount } from "wagmi";
import { FollowButton } from "@/components/shared/follow-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useProfileBalances } from "@/hooks/use-profile-balances";
import { formatAddress } from "@/lib/utils";
import type { ZoraProfile } from "@/types/profile";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
	username: string;
}

export function ProfileHeader({ username }: ProfileHeaderProps) {
	const { address: connectedAddress } = useAccount();
	const { data: profile, isLoading: isLoadingProfile } = useProfile(username);
	const { data: balances, isLoading: isLoadingBalances } = useProfileBalances(
		profile?.address || "",
	);

	if (isLoadingProfile) return <ProfileHeaderSkeleton />;

	if (!profile) return <div>User not found.</div>;

	const isOwnProfile = connectedAddress === profile.address;
	const displayName = profile.displayName || "Anonymous";
	const dropsCount = balances?.length || 0;
	// TODO: Replace with actual data from off-chain DB once available.
	const followingCount = 0;
	const followersCount = 0;

	return (
		<div className="flex w-full flex-col items-center justify-center gap-6 border-b pb-8">
			{/* Profile Avatar */}
			<UserAvatar src={profile.avatarUrl} alt={displayName} size="xl" />

			{/* Profile Info - Centered */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="font-bold text-2xl">{displayName}</h1>
				{profile.address && (
					<p className="text-muted-foreground">
						@{profile.username || formatAddress(profile.address)}
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
					profile.address && <FollowButton userId={profile.address} />
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
