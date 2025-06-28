"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useFollowSocial } from "@/hooks/use-social";

interface FollowButtonProps {
	userId: string;
}

export function FollowButton({ userId }: FollowButtonProps) {
	const { address } = useAccount();
	const follow = useFollowSocial({ followeeAddress: userId });

	const handleFollow = () => {
		follow.toggleFollow();
	};

	const isLoading = follow.isFollowLoading;

	return (
		<Button
			onClick={handleFollow}
			disabled={isLoading || !address}
			variant="default"
			className="rounded-full px-8"
		>
			{isLoading ? "..." : "Follow"}
		</Button>
	);
}
