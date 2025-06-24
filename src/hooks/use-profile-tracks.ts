import { useApiQuery } from "@/hooks/use-api-query";
import type { Track } from "@/types/track";

export function useProfileTracks(username: string) {
	return useApiQuery<Track[]>(
		["profile-tracks", username],
		`/api/user/tracks/${username}`,
		{
			enabled: !!username,
		},
	);
}
