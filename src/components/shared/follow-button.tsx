"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";
import { useIsFollowing } from "@/hooks/use-is-following";

interface FollowButtonProps {
	userId: string;
}

export function FollowButton({ userId }: FollowButtonProps) {
	const { address } = useAccount();
	const { data: isFollowing, isLoading: isFollowLoading } = useIsFollowing(userId);
	const followMutation = useFollow();

	const handleFollow = () => {
		followMutation.mutate(userId);
	};

	const isLoading = isFollowLoading || followMutation.isPending;

	return (
		<Button
			onClick={handleFollow}
			disabled={isLoading || !address}
			variant={isFollowing ? "secondary" : "default"}
			className="rounded-full px-8"
		>
			{isLoading ? "..." : isFollowing ? "Following" : "Follow"}
		</Button>
	);
}
