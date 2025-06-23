import { usePrivy } from "@privy-io/react-auth";
import {
	type UseMutationOptions,
	type UseMutationResult,
	useMutation,
} from "@tanstack/react-query";

interface UseApiMutationProps<TData, TVariables> {
	endpoint: string;
	method: "POST" | "PUT" | "DELETE" | "PATCH";
	options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">;
}

export function useApiMutation<TData = unknown, TVariables = unknown>({
	endpoint,
	method,
	options,
}: UseApiMutationProps<TData, TVariables>): UseMutationResult<
	TData,
	Error,
	TVariables
> {
	const { getAccessToken } = usePrivy();

	const mutationFn = async (variables: TVariables) => {
		const token = await getAccessToken();
		if (!token) {
			throw new Error("Not authenticated");
		}

		const response = await fetch(endpoint, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: variables ? JSON.stringify(variables) : undefined,
		});

		if (!response.ok) {
			const errorBody = await response.json().catch(() => ({
				message: "An unknown error occurred",
			}));
			throw new Error(errorBody.message || "API request failed");
		}

		if (
			response.status === 204 ||
			response.headers.get("Content-Length") === "0"
		) {
			return null as TData;
		}

		return response.json() as Promise<TData>;
	};

	return useMutation({
		mutationFn,
		...options,
	});
}
