"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Library, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

	const profileHref =
		ready && authenticated && user?.wallet
			? `/profile/${user.wallet.address}`
			: "/";

	const navLinks = [
		{
			href: "/",
			label: "Home",
			icon: HomeIcon,
			iconFill: HomeFillIcon,
			isActive: () => pathname === "/",
		},
		{
			href: "/library",
			label: "Library",
			icon: Library,
			iconFill: Library,
			isActive: () => pathname.startsWith("/library"),
		},
		{
			href: profileHref,
			label: "Profile",
			icon: PersonIcon,
			iconFill: PersonFillIcon,
			isActive: () => pathname.startsWith("/profile"),
		},
	];

	if (collapsed) {
		return (
			<div
				className={cn(
					"flex h-full flex-col transition-all duration-200 bg-background",
					"w-16",
				)}
			>
				{/* Top: Logo (optional) */}
				<div className="flex h-16 items-center justify-center">
					<Logo variant="sidebar" />
				</div>
				{/* Center: Main Nav */}
				<nav className="flex-1 flex flex-col justify-center items-center gap-2">
					{/* Toggle button as first nav item */}
					<button
						type="button"
						aria-label="Expand sidebar"
						onClick={() => setCollapsed(false)}
						className="flex justify-center items-center rounded-lg px-0 py-3 w-full hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring mb-2"
					>
						<PanelLeftOpen className="h-5 w-5" />
					</button>
					{navLinks.map((link) => {
						const isActive = link.isActive();
						const IconComponent = link.iconFill
							? isActive
								? link.iconFill
								: link.icon
							: link.icon;
						const isProtected =
							link.label === "Profile" || link.label === "Library";
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"flex items-center justify-center rounded-lg px-0 py-3 font-medium transition-colors",
									isProtected && !authenticated
										? "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
										: isActive
											? "text-foreground bg-muted"
											: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
								)}
								onClick={
									isProtected && !authenticated
										? (e) => {
												e.preventDefault();
												login();
											}
										: undefined
								}
							>
								<IconComponent className="h-5 w-5" />
							</Link>
						);
					})}
				</nav>
				{/* Bottom: Profile/Settings (optional, can add here) */}
				<div className="mb-4 flex flex-col items-center gap-2">
					{/* Example: Profile icon or settings */}
					{/* Add your profile/settings/logout here if needed */}
				</div>
			</div>
		);
	}

	// Expanded: logo and toggle at top, centered nav, bottom profile/settings
	return (
		<div
			className={cn(
				"flex h-full flex-col transition-all duration-200 bg-background",
				"w-64",
			)}
		>
			{/* Top: Logo */}
			<div className="flex h-16 items-center px-2 gap-2">
				<Logo variant="sidebar" />
				<button
					type="button"
					aria-label="Collapse sidebar"
					onClick={() => setCollapsed(true)}
					className="ml-auto rounded-md p-2 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<PanelLeftOpen className="h-5 w-5 transform rotate-180" />
				</button>
			</div>
			{/* Center: Main Nav */}
			<nav className="flex-1 flex flex-col justify-center gap-2">
				{navLinks.map((link) => {
					const isActive = link.isActive();
					const IconComponent = link.iconFill
						? isActive
							? link.iconFill
							: link.icon
						: link.icon;
					const isProtected =
						link.label === "Profile" || link.label === "Library";
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-2 py-3 font-medium transition-colors",
								isProtected && !authenticated
									? "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
									: isActive
										? "text-foreground bg-muted"
										: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
							)}
							onClick={
								isProtected && !authenticated
									? (e) => {
											e.preventDefault();
											login();
										}
									: undefined
							}
						>
							<IconComponent className="h-5 w-5" />
							<span>{link.label}</span>
						</Link>
					);
				})}
			</nav>
			{/* Bottom: Profile/Settings (optional, can add here) */}
			<div className="mb-4 flex flex-col items-center gap-2">
				{/* Example: Profile icon or settings */}
				{/* Add your profile/settings/logout here if needed */}
			</div>
		</div>
	);
}
