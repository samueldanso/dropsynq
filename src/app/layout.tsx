import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SynqBase — Tokenize, Connect & Monetize Your Fanbase",
	description:
		"SynqBase is the SocialFi music platform where artists tokenize their music and fans earn rewards for engagement - powered by Zora's Protocol.",
	icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${manrope.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
