import { useApiQuery } from "./use-api-query";

interface FollowingApiResponse {
	data: string[];
}

export function useFollowing(address: string) {
	return useApiQuery<FollowingApiResponse, string[]>(
		["following", address],
		`/api/user/${address}/follow`,
		{
			enabled: !!address,
			select: (response) => response.data,
		},
	);
}
