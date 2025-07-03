import Image from "next/image";
import Link from "next/link";

interface LogoProps {
	className?: string;
	variant?: "sidebar" | "header";
}

export function Logo({ className = "", variant = "header" }: LogoProps) {
	const size = variant === "sidebar" ? 32 : 40;
	return (
		<Link
			href="/"
			className={`flex items-center gap-2 ${className}`}
			aria-label="DropSynq Home"
		>
			<Image
				src="/icon.svg"
				alt="DropSynq Logo"
				width={size}
				height={size}
				priority
			/>
			<span
				className={`font-bold text-foreground ${
					variant === "sidebar" ? "text-lg" : "text-xl"
				}`}
			>
				DropSynq
			</span>
		</Link>
	);
}
