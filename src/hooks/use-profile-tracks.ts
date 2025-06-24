import { useApiQuery } from "@/hooks/use-api-query";
import type { ZoraCoin } from "@/types/coin";

export function useProfileTracks(username: string) {
	return useApiQuery<ZoraCoin[]>(
		["profile-tracks", username],
		`/api/user/tracks/${username}`,
		{
			enabled: !!username,
		},
	);
}
