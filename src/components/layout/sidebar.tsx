"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@zoralabs/coins-sdk";
import { Heart, Music2, PanelLeftOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CoinsIcon from "@/components/icons/coins.svg";
import CompassIcon from "@/components/icons/compass.svg";
import CompassFillIcon from "@/components/icons/compassFill.svg";
import HomeIcon from "@/components/icons/home.svg";
import HomeFillIcon from "@/components/icons/homeFill.svg";
import PersonIcon from "@/components/icons/person.svg";
import PersonFillIcon from "@/components/icons/personFill.svg";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function AppSidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();
	const { ready, authenticated, user, login } = usePrivy();

	// Fetch Zora profile for handle (if authenticated)
	const { data: zoraProfile } = useQuery({
		queryKey: ["zora-profile", user?.wallet?.address],
		queryFn: async () => {
			if (!user?.wallet?.address) return null;
			const res = await getProfile({ identifier: user.wallet.address });
			return res?.data?.profile;
		},
		enabled: !!user?.wallet?.address,
	});

	// Helper to get profile base href
	const profileBaseHref =
		ready && authenticated && user?.wallet
			? zoraProfile?.handle
				? `/profile/${zoraProfile.handle}`
				: `/profile/${user.wallet.address}`
			: "/";

	// My Library links config
	const myLibraryLinks = [
		{ label: "Tracks", icon: Music2, tab: "drops" },
		{ label: "Favorites", icon: Heart, tab: "favorites" },
		{ label: "Collections", icon: Star, tab: "collection" },
	];

	const mainNavLinks = [
		{
			href: "/",
			label: "Home",
			icon: HomeIcon,
			iconFill: HomeFillIcon,
			isActive: () => pathname === "/",
		},
		{
			href: "/artists",
			label: "Artists",
			icon: CompassIcon,
			iconFill: CompassFillIcon,
			isActive: () => pathname.startsWith("/artists"),
		},
		{
			href: "/drops",
			label: "Drops",
			icon: CoinsIcon,
			iconFill: CoinsIcon,
			isActive: () => pathname.startsWith("/drops"),
		},
	];

	const profileLink = {
		href: profileBaseHref,
		label: "Profile",
		icon: PersonIcon,
		iconFill: PersonFillIcon,
		isActive: () => pathname.startsWith("/profile"),
	};

	if (collapsed) {
		return (
			<div
				className={cn(
					// Minimal floating card style for sidebar
					"flex h-full flex-col transition-all duration-200",
					"w-16 pl-2",
					"bg-card rounded-2xl shadow-lg", // Remove border
					"mt-1 ml-1 mb-1", // Only 4px (mt-1) at top and bottom
				)}
			>
				{/* Top: Icon only */}
				<div className="flex h-16 items-center justify-center">
					<Image src="/icon.svg" alt="Logo" width={32} height={32} priority />
				</div>
				{/* Center: Main Nav */}
				<nav className="flex flex-col items-center gap-2 mt-6 w-full flex-1">
					{/* Toggle button as first nav item */}
					<button
						type="button"
						aria-label="Expand sidebar"
						onClick={() => setCollapsed(false)}
						className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring mb-2 transition-colors"
					>
						<PanelLeftOpen className="h-5 w-5" />
					</button>
					{/* Main nav icons */}
					{mainNavLinks.map((link) => {
						const isActive = link.isActive();
						const IconComponent = link.iconFill
							? isActive
								? link.iconFill
								: link.icon
							: link.icon;
						const isProtected = link.label === "Profile";
						return (
							<Link
								key={link.href}
								href={link.href}
								className="flex items-center justify-center w-full"
								onClick={
									isProtected && !authenticated
										? (e) => {
												e.preventDefault();
												login();
											}
										: undefined
								}
							>
								<span
									className={cn(
										"flex items-center justify-center w-10 h-10 rounded-full transition-colors",
										isProtected && !authenticated
											? "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
											: isActive
												? "text-foreground"
												: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
									)}
								>
									<IconComponent className="h-5 w-5 mx-auto" />
								</span>
							</Link>
						);
					})}
					{/* My Library icons */}
					<div className="flex flex-col items-center gap-2 mt-8">
						{myLibraryLinks.map((link) => {
							const IconComponent = link.icon;
							return (
								<Link
									key={link.tab}
									href={`${profileBaseHref}?tab=${link.tab}`}
									className="flex items-center justify-center w-full"
								>
									<span className="flex items-center justify-center w-10 h-10 rounded-full transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">
										<IconComponent className="h-5 w-5 mx-auto" />
									</span>
								</Link>
							);
						})}
					</div>
				</nav>
				{/* Profile icon at bottom */}
				<div className="flex flex-col items-center mb-4 mt-auto">
					<Link
						href={profileBaseHref}
						className="flex items-center justify-center w-full"
					>
						<span className="flex items-center justify-center w-10 h-10 rounded-full transition-colors text-muted-foreground hover:bg-accent/50 hover:text-foreground">
							<PersonIcon className="h-5 w-5 mx-auto" />
						</span>
					</Link>
				</div>
			</div>
		);
	}

	// Expanded: logo and toggle at top, centered nav
	return (
		<div
			className={cn(
				"flex h-full flex-col transition-all duration-200",
				collapsed ? "w-16 pl-2" : "w-64 pl-2",
				"bg-card rounded-2xl shadow-lg mt-1 ml-1 mb-1",
			)}
		>
			{/* Top: Logo */}
			<div className="flex h-16 items-center px-2 gap-2">
				<Logo variant="sidebar" />
				{!collapsed && (
					<button
						type="button"
						aria-label="Collapse sidebar"
						onClick={() => setCollapsed(true)}
						className="ml-auto rounded-md p-2 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<PanelLeftOpen className="h-5 w-5 transform rotate-180" />
					</button>
				)}
			</div>
			<nav className="flex-1 flex flex-col gap-2 mt-6">
				{/* Main Navigation */}
				{mainNavLinks.map((link) => {
					const isActive = link.isActive();
					const IconComponent = isActive ? link.iconFill : link.icon;
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-4 py-2 font-medium transition-colors",
								isActive
									? "text-foreground font-semibold"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<IconComponent className="h-5 w-5" />
							{!collapsed && <span>{link.label}</span>}
						</Link>
					);
				})}
				{/* My Library Section Header */}
				{!collapsed && (
					<div className="px-4 pt-6 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none cursor-default">
						My Library
					</div>
				)}
				{/* My Library Links */}
				<div className="flex flex-col gap-1">
					{myLibraryLinks.map((link) => {
						const IconComponent = link.icon;
						return (
							<Link
								key={link.tab}
								href={`${profileBaseHref}?tab=${link.tab}`}
								className="flex items-center gap-3 rounded-lg px-2 py-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							>
								<IconComponent className="h-5 w-5" />
								<span>{link.label}</span>
							</Link>
						);
					})}
				</div>
			</nav>
			{/* Profile at the bottom */}
			<div className="mt-auto mb-4 px-4">
				<Link
					href={profileBaseHref}
					className="flex items-center gap-3 rounded-lg px-2 py-2 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
				>
					<PersonIcon className="h-5 w-5" />
					<span>Profile</span>
				</Link>
			</div>
		</div>
	);
}
