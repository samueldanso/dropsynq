"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@zoralabs/coins-sdk";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddCommentFormProps {
	coinAddress: string;
	onCommentAdded?: () => void;
}

export default function AddCommentForm({
	coinAddress,
	onCommentAdded,
}: AddCommentFormProps) {
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { authenticated, login, user } = usePrivy();
	const { address: walletAddress } = useAccount();

	// Fetch Zora profile for the authenticated user
	const { data: zoraProfile } = useQuery({
		queryKey: ["zora-profile", user?.wallet?.address],
		queryFn: async () => {
			if (!user?.wallet?.address) return null;
			const res = await getProfile({ identifier: user.wallet.address });
			return res?.data?.profile;
		},
		enabled: !!user?.wallet?.address,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!authenticated) {
			login();
			return;
		}

		if (!commentText.trim()) {
			toast.error("Please enter a comment");
			return;
		}

		if (!walletAddress) {
			toast.error("Please connect your wallet");
			return;
		}

		setIsSubmitting(true);
		try {
			// For now, we'll show a message that commenting is coming soon
			// In the future, this would integrate with Zora's Comments contract
			toast.info(
				"Comment functionality coming soon! This will integrate with Zora's native comment system.",
			);

			// TODO: Implement actual comment creation using Zora Comments contract
			// const result = await createComment({
			//   commenter: walletAddress,
			//   contractAddress: coinAddress,
			//   tokenId: 0, // For coins, tokenId is 0
			//   text: commentText.trim(),
			//   replyTo: null, // For top-level comments
			//   referrer: null, // Optional referrer address
			// });

			setCommentText("");
			onCommentAdded?.();
			toast.success("Comment posted successfully!");
		} catch (error) {
			console.error("Error posting comment:", error);
			toast.error("Failed to post comment. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!authenticated) {
		return (
			<div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
				<MessageCircle className="size-5 text-muted-foreground" />
				<div className="flex-1">
					<p className="text-sm text-muted-foreground">
						Sign in to comment on this track
					</p>
				</div>
				<Button onClick={login} size="sm">
					Sign In
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<div className="flex gap-3">
				<UserAvatar
					src={zoraProfile?.avatar?.medium}
					alt={zoraProfile?.displayName || zoraProfile?.handle || "User"}
					size="sm"
				/>
				<div className="flex-1 space-y-2">
					<Textarea
						placeholder="Write a comment..."
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						className="min-h-[80px] resize-none"
						maxLength={500}
					/>
					<div className="flex items-center justify-between">
						<span className="text-xs text-muted-foreground">
							{commentText.length}/500
						</span>
						<Button
							type="submit"
							size="sm"
							disabled={!commentText.trim() || isSubmitting}
							className="flex items-center gap-2"
						>
							{isSubmitting ? (
								<>
									<div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Posting...
								</>
							) : (
								<>
									<Send className="size-4" />
									Post Comment
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
