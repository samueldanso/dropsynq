"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoinsNew } from "@zoralabs/coins-sdk";
import { Music, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { ZoraCoin } from "@/types/zora";

export const SearchBar = () => {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState<"all" | "tracks" | "users">(
		"all",
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Debounce search query to avoid too many API calls
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	// Search for coins (tracks) - using newest type for search
	const { data: coins = [], isLoading: isLoadingCoins } = useQuery({
		queryKey: ["discover-coins", "newest"],
		queryFn: async () => {
			const response = await getCoinsNew();
			// Extract coins from the response
			const coins =
				response?.data?.exploreList?.edges?.map((edge: any) => edge.node) || [];
			return coins;
		},
	});

	// Filter results based on active filter and search query
	const filteredResults = useMemo(() => {
		if (!debouncedQuery.trim()) return { coins: [], users: [] };

		const filteredCoins = coins.filter(
			(coin: ZoraCoin) =>
				coin.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
				coin.description.toLowerCase().includes(debouncedQuery.toLowerCase()),
		);

		// Extract unique users from coins
		const userMap = new Map();
		coins.forEach((coin: ZoraCoin) => {
			if (
				coin.creatorProfile &&
				coin.creatorProfile.handle
					?.toLowerCase()
					.includes(debouncedQuery.toLowerCase())
			) {
				userMap.set(coin.creatorProfile.id, coin.creatorProfile);
			}
		});
		const filteredUsers = Array.from(userMap.values());

		switch (activeFilter) {
			case "tracks":
				return { coins: filteredCoins, users: [] };
			case "users":
				return { coins: [], users: filteredUsers };
			default:
				return { coins: filteredCoins, users: filteredUsers };
		}
	}, [activeFilter, coins, debouncedQuery]);

	const isLoading = isLoadingCoins;

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		setIsOpen(value.trim().length > 0);
	};

	const handleCoinClick = (coin: ZoraCoin) => {
		// Navigate to coin detail page
		router.push(`/coin/${coin.address}`);
		setQuery("");
		setIsOpen(false);
		inputRef.current?.blur();
	};

	const handleUserClick = (user: any) => {
		// Navigate to profile
		const identifier = user.handle || user.address;
		router.push(`/profile/${identifier}`);
		setQuery("");
		setIsOpen(false);
		inputRef.current?.blur();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsOpen(false);
			inputRef.current?.blur();
		}
	};

	const filterTabs = [
		{ key: "all", label: "All", icon: Search },
		{ key: "tracks", label: "Tracks", icon: Music },
		{ key: "users", label: "Artists", icon: User },
	] as const;

	return (
		<div className="relative w-full">
			<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				ref={inputRef}
				type="text"
				placeholder="Search for songs, artists, coins!"
				value={query}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onFocus={() => query.trim().length > 0 && setIsOpen(true)}
				className="h-10 w-full rounded-full border bg-input text-foreground shadow-md pl-11 pr-4 focus:bg-background focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
			/>

			{/* Search Results Dropdown */}
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute left-0 top-13 z-50 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg"
				>
					{/* Filter Tabs */}
					{debouncedQuery.trim().length > 0 && (
						<div className="flex gap-1 border-b border-border p-2">
							{filterTabs.map((tab) => {
								const Icon = tab.icon;
								return (
									<button
										key={tab.key}
										type="button"
										onClick={() => setActiveFilter(tab.key)}
										className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
											activeFilter === tab.key
												? "bg-accent text-accent-foreground shadow-sm"
												: "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
										}`}
									>
										<Icon className="h-3 w-3" />
										{tab.label}
									</button>
								);
							})}
						</div>
					)}

					{isLoading ? (
						<div className="p-4 text-center text-muted-foreground">
							Searching...
						</div>
					) : filteredResults.coins.length > 0 ||
						filteredResults.users.length > 0 ? (
						<div className="py-2">
							{/* Tracks Section */}
							{filteredResults.coins.length > 0 && (
								<>
									<div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Tracks
									</div>
									{filteredResults.coins.map((coin: ZoraCoin) => (
										<button
											key={coin.address}
											type="button"
											onClick={() => handleCoinClick(coin)}
											className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50"
										>
											<div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
												<Music className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center gap-2">
													<span className="truncate font-medium text-foreground">
														{coin.name}
													</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<span>
														by {coin.creatorProfile?.handle || "Unknown Artist"}
													</span>
													{coin.creatorProfile?.handle && (
														<>
															<span>•</span>
															<span>@{coin.creatorProfile.handle}</span>
														</>
													)}
												</div>
											</div>
										</button>
									))}
								</>
							)}

							{/* Users Section */}
							{filteredResults.users.length > 0 && (
								<>
									<div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
										Artists
									</div>
									{filteredResults.users.map((user: any) => (
										<button
											key={user.address}
											type="button"
											onClick={() => handleUserClick(user)}
											className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50"
										>
											<div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
												<User className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center gap-2">
													<span className="truncate font-medium text-foreground">
														{user.displayName ||
															user.handle ||
															"Unknown Artist"}
													</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													{user.handle && (
														<>
															<span>@{user.handle}</span>
															<span>•</span>
														</>
													)}
													<span>
														{user.address?.slice(0, 6)}...
														{user.address?.slice(-4)}
													</span>
												</div>
											</div>
										</button>
									))}
								</>
							)}
						</div>
					) : debouncedQuery.trim().length > 0 ? (
						<div className="p-4 text-center text-muted-foreground">
							No results found for "{debouncedQuery}"
						</div>
					) : null}
				</div>
			)}
		</div>
	);
};
