import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

async function apiFetch<TData>(endpoint: string): Promise<TData> {
	const response = await fetch(endpoint);
	if (!response.ok) {
		const errorBody = await response.json().catch(() => ({
			message: "An unknown error occurred",
		}));
		throw new Error(errorBody.message || "API request failed");
	}
	return response.json() as Promise<TData>;
}

export function useApiQuery<TData, TSelect = TData>(
	queryKey: unknown[],
	endpoint: string,
	options?: Omit<UseQueryOptions<TData, Error, TSelect>, "queryKey" | "queryFn">,
) {
	return useQuery<TData, Error, TSelect>({
		queryKey,
		queryFn: () => apiFetch<TData>(endpoint),
		...options,
	});
}
