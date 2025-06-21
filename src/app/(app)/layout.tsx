import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<Sidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
