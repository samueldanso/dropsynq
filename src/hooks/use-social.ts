import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccount } from "wagmi";

// Song-related social actions
interface UseSongSocialProps {
	coinAddress: string;
	userAddress?: string;
}

export function useSongSocial({
	coinAddress,
	userAddress,
}: UseSongSocialProps) {
	const queryClient = useQueryClient();

	// Check if user has liked this song
	const { data: isLiked, isLoading: isLikeLoading } = useQuery({
		queryKey: ["song-like", coinAddress, userAddress],
		queryFn: async () => {
			if (!userAddress) return false;
			const response = await fetch(
				`/api/songs/${coinAddress}/like?user=${userAddress}`,
			);
			if (!response.ok) return false;
			const data = await response.json();
			return data.data?.isLiked || false;
		},
		enabled: !!coinAddress && !!userAddress,
	});

	// Like song mutation
	const likeMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/songs/${coinAddress}/like`, {
				method: "POST",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to like song");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Song liked!");
			queryClient.invalidateQueries({
				queryKey: ["song-like", coinAddress, userAddress],
			});
			queryClient.invalidateQueries({
				queryKey: ["like-count", coinAddress],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to like song");
		},
	});

	// Unlike song mutation
	const unlikeMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/songs/${coinAddress}/like`, {
				method: "DELETE",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to unlike song");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Song unliked!");
			queryClient.invalidateQueries({
				queryKey: ["song-like", coinAddress, userAddress],
			});
			queryClient.invalidateQueries({
				queryKey: ["like-count", coinAddress],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to unlike song");
		},
	});

	const toggleLike = () => {
		if (isLiked) {
			unlikeMutation.mutate();
		} else {
			likeMutation.mutate();
		}
	};

	return {
		// Like data
		isLiked: isLiked || false,
		isLikeLoading,
		toggleLike,
		like: likeMutation.mutate,
		unlike: unlikeMutation.mutate,
		isLikeMutationLoading: likeMutation.isPending,
		isUnlikeMutationLoading: unlikeMutation.isPending,
	};
}

// Like count hook
interface UseLikeCountProps {
	coinAddress: string;
}

export function useLikeCount({ coinAddress }: UseLikeCountProps) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["like-count", coinAddress],
		queryFn: async () => {
			const response = await fetch(`/api/songs/${coinAddress}/likes`);
			if (!response.ok) {
				throw new Error("Failed to fetch like count");
			}
			const data = await response.json();
			return data.data?.count || 0;
		},
		enabled: !!coinAddress,
	});

	return {
		likeCount: data || 0,
		isLoading,
		error,
	};
}

// User profile social data
interface UseUserSocialProps {
	handle: string;
	limit?: number;
	offset?: number;
}

export function useUserSocial({
	handle,
	limit = 20,
	offset = 0,
}: UseUserSocialProps) {
	// Get user's liked songs
	const { data: likes, isLoading: isLikesLoading } = useQuery({
		queryKey: ["user-likes", handle, limit, offset],
		queryFn: async () => {
			const response = await fetch(
				`/api/profile/${handle}/likes?limit=${limit}&offset=${offset}`,
			);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch user likes");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!handle,
	});

	// Get user's comments
	const { data: comments, isLoading: isCommentsLoading } = useQuery({
		queryKey: ["user-comments", handle, limit, offset],
		queryFn: async () => {
			const response = await fetch(
				`/api/profile/${handle}/comments?limit=${limit}&offset=${offset}`,
			);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch user comments");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!handle,
	});

	return {
		// User's liked songs
		likes: likes || [],
		isLikesLoading,

		// User's comments
		comments: comments || [],
		isCommentsLoading,
	};
}

// Follow-related social actions
interface UseFollowSocialProps {
	followeeAddress: string;
}

export function useFollowSocial({ followeeAddress }: UseFollowSocialProps) {
	const queryClient = useQueryClient();
	const { address: followerAddress } = useAccount();

	// Check if user is following this person
	const { data: isFollowing, isLoading: isFollowingLoading } = useQuery({
		queryKey: ["isFollowing", followerAddress, followeeAddress],
		queryFn: async () => {
			if (!followerAddress || !followeeAddress) return false;
			const response = await fetch(`/api/profile/${followeeAddress}/follow`);
			if (!response.ok) return false;
			const data = await response.json();
			return data.data?.includes(followerAddress) || false;
		},
		enabled: !!followerAddress && !!followeeAddress,
	});

	// Get list of who this user is following
	const { data: following, isLoading: isFollowingListLoading } = useQuery({
		queryKey: ["following", followeeAddress],
		queryFn: async () => {
			const response = await fetch(`/api/profile/${followeeAddress}/follow`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch following list");
			}
			const data = await response.json();
			return data.data || [];
		},
		enabled: !!followeeAddress,
	});

	// Follow/unfollow mutation
	const followMutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/profile/${followeeAddress}/follow`, {
				method: "POST",
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to follow/unfollow");
			}
			return response.json();
		},
		onSuccess: (data) => {
			toast.success(
				data.data.status === "followed"
					? "Successfully followed"
					: "Successfully unfollowed",
			);
			// Invalidate related queries
			queryClient.invalidateQueries({
				queryKey: ["isFollowing", followerAddress, followeeAddress],
			});
			queryClient.invalidateQueries({
				queryKey: ["following", followeeAddress],
			});
			// Invalidate follow counts for both users
			queryClient.invalidateQueries({
				queryKey: ["follow-counts"],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to follow/unfollow");
		},
	});

	const toggleFollow = () => {
		followMutation.mutate();
	};

	return {
		// Follow data
		isFollowing: isFollowing || false,
		isFollowingLoading,
		toggleFollow,
		follow: followMutation.mutate,
		isFollowLoading: followMutation.isPending,

		// Following list data
		following: following || [],
		isFollowingListLoading,
	};
}

// Follow counts hook
interface UseFollowCountsProps {
	handle: string;
}

export function useFollowCounts({ handle }: UseFollowCountsProps) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["follow-counts", handle],
		queryFn: async () => {
			const response = await fetch(`/api/profile/${handle}/follow-count`);
			if (!response.ok) {
				throw new Error("Failed to fetch follow counts");
			}
			const data = await response.json();
			return data.data;
		},
		enabled: !!handle,
	});

	return {
		followers: data?.followers || 0,
		following: data?.following || 0,
		isLoading,
		error,
	};
}
