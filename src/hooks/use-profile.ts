import { useApiQuery } from "@/hooks/use-api-query";
import type { ZoraProfile } from "@/types/profile";

export function useProfile(username: string) {
	return useApiQuery<ZoraProfile>(
		["profile", username],
		`/api/user/profile/${username}`,
		{
			enabled: !!username,
		},
	);
}
