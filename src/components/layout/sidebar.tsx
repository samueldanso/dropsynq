"use client";

import { usePrivy } from "@privy-io/react-auth";
import { PanelLeftOpen, PanelRightClose } from "lucide-react";
import Image from "next/image";
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
			href: profileHref,
			label: "Profile",
			icon: PersonIcon,
			iconFill: PersonFillIcon,
			isActive: () => pathname.startsWith("/profile"),
		},
	];

	return (
		<div
			className={cn(
				"flex h-full flex-col py-1.5 transition-all duration-200 bg-background",
				collapsed ? "w-16" : "w-60",
			)}
		>
			{/* Logo and Toggle */}
			<div className="flex h-16 items-center px-2 gap-2">
				{/* Show only icon as link when collapsed, full logo when expanded */}
				{collapsed ? (
					<Link href="/" aria-label="SynqDrop Home">
						<Image
							src="/icon.svg"
							alt="SynqDrop Logo"
							width={32}
							height={32}
							priority
						/>
					</Link>
				) : (
					<Logo variant="sidebar" />
				)}
				<button
					type="button"
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					onClick={() => setCollapsed((c) => !c)}
					className="ml-auto rounded-md p-2 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring"
				>
					{collapsed ? (
						<PanelLeftOpen className="h-5 w-5" />
					) : (
						<PanelRightClose className="h-5 w-5" />
					)}
				</button>
			</div>
			{/* Navigation Links */}
			<nav className="flex-1 px-2 pt-2">
				<div className="w-full space-y-2">
					{navLinks.map((link) => {
						const isActive = link.isActive();
						const IconComponent = isActive ? link.iconFill : link.icon;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-2 py-3 font-medium transition-colors",
									isActive
										? "text-foreground bg-muted"
										: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
									collapsed && "justify-center px-0",
								)}
								onClick={
									link.label === "Profile" && !authenticated
										? (e) => {
												e.preventDefault();
												login();
											}
										: undefined
								}
							>
								<IconComponent className="h-5 w-5" />
								{!collapsed && <span>{link.label}</span>}
							</Link>
						);
					})}
				</div>
			</nav>
		</div>
	);
}
