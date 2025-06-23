import { createServerClient } from "@supabase/ssr";
import type { cookies } from "next/headers";
import { env } from "@/env";

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
	const resolvedCookies = await cookieStore;

	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return resolvedCookies.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							resolvedCookies.set(name, value, options),
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};
