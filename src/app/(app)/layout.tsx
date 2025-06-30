import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen">
			<AppSidebar />
			<div className="flex-1 flex flex-col">
				<AppHeader />
				<main className="flex-1 overflow-y-auto">
					<div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
				</main>
			</div>
		</div>
	);
}
