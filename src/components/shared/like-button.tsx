"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useSongSocial } from "@/hooks/use-social";

interface LikeButtonProps {
	trackId: string;
}

export function LikeButton({ trackId }: LikeButtonProps) {
	const { address } = useAccount();
	const { isLiked, isLikeLoading, toggleLike } = useSongSocial({
		coinAddress: trackId,
		userAddress: address,
	});

	return (
		<Button onClick={toggleLike} disabled={!address || isLikeLoading}>
			{isLikeLoading ? "..." : isLiked ? "Unlike" : "Like"}
		</Button>
	);
}
