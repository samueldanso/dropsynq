"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";

interface FollowButtonProps {
  userId: string;
}

export function FollowButton({ userId }: FollowButtonProps) {
  const { address } = useAccount();
  const followMutation = useFollow(userId);

  const handleFollow = () => {
    followMutation.mutate({});
  };

  const isLoading = followMutation.isPending;

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
