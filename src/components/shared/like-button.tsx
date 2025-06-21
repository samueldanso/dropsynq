"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
	trackId: string;
}

export function LikeButton({ trackId }: LikeButtonProps) {
	const { ready, authenticated, login } = usePrivy();

	// We can also show a loading skeleton here
	if (!ready) {
		return <Button disabled>Like</Button>;
	}

	const handleLike = () => {
		if (!authenticated) {
			login();
			return;
		}
		// If authenticated, proceed with like logic
		console.log(`Liking track ${trackId}`);
		// Here you would typically call a mutation
		// likeAction({ trackId });
	};

	return <Button onClick={handleLike}>Like</Button>;
}
