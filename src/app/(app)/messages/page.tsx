export default function MessagesPage() {
	return (
		<div className="flex h-[calc(100vh-64px)] w-full bg-background">
			{/* Sidebar (for context, not interactive here) */}
			<aside className="hidden md:flex flex-col w-20 bg-muted border-r border-border items-center py-6 gap-8">
				<div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
					<svg
						className="size-6 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 3h-6a2 2 0 00-2 2v2h10V5a2 2 0 00-2-2z"
						/>
					</svg>
				</div>
				<nav className="flex flex-col gap-6 mt-8">
					<div className="size-8 rounded-full bg-accent flex items-center justify-center">
						<svg
							className="size-5 text-accent-foreground"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 3h-6a2 2 0 00-2 2v2h10V5a2 2 0 00-2-2z"
							/>
						</svg>
					</div>
				</nav>
			</aside>

			{/* Main content */}
			<main className="flex flex-1 h-full">
				{/* Chat list */}
				<section className="w-80 bg-card border-r border-border flex flex-col">
					<div className="p-6 border-b border-border">
						<h2 className="text-xl font-bold">Messages</h2>
					</div>
					<div className="flex-1 overflow-y-auto">
						<div className="p-4 flex flex-col gap-2">
							<div className="flex items-center gap-3 p-3 rounded-lg bg-accent cursor-pointer">
								<div className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
									<svg
										className="size-6 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 3h-6a2 2 0 00-2 2v2h10V5a2 2 0 00-2-2z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<div className="font-medium">Group Chat</div>
									<div className="text-xs text-muted-foreground truncate">
										hello
									</div>
								</div>
								<span className="text-xs text-muted-foreground">Pinned</span>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
								<div className="size-10 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-500/10 flex items-center justify-center">
									<span className="font-bold text-lg text-blue-700">J</span>
								</div>
								<div className="flex-1">
									<div className="font-medium">James Juke</div>
									<div className="text-xs text-muted-foreground truncate">
										Hello beautiful person, it's Jam...
									</div>
								</div>
								<span className="text-xs text-muted-foreground">Jun 3</span>
							</div>
						</div>
					</div>
				</section>

				{/* Chat window */}
				<section className="flex-1 flex flex-col bg-background">
					<div className="flex items-center justify-between px-8 py-6 border-b border-border">
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
								<svg
									className="size-6 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 3h-6a2 2 0 00-2 2v2h10V5a2 2 0 00-2-2z"
									/>
								</svg>
							</div>
							<div>
								<div className="font-semibold">Group Chat</div>
								<div className="text-xs text-muted-foreground">See details</div>
							</div>
						</div>
					</div>
					<div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
						<div className="self-end bg-primary text-primary-foreground px-4 py-2 rounded-2xl max-w-xs shadow">
							Ayyy no way!! So happy you dig it :)
						</div>
						<div className="self-start bg-muted px-4 py-2 rounded-2xl max-w-xs shadow">
							Who doesn't love Cakes? but really though, the whole thing is the
							real deal
						</div>
						<div className="self-end bg-primary text-primary-foreground px-4 py-2 rounded-2xl max-w-xs shadow">
							hello
						</div>
						<div className="self-center mt-8">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
								<span className="size-2 rounded-full bg-primary animate-pulse"></span>
								Direct artist-fan messaging coming soon
							</div>
						</div>
					</div>
					<div className="border-t border-border px-8 py-4 flex items-center gap-4">
						<input
							type="text"
							className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none"
							placeholder="Type a message... (coming soon)"
							disabled
						/>
						<button
							type="button"
							className="rounded-full bg-primary text-primary-foreground px-4 py-2 font-medium opacity-60 cursor-not-allowed"
							disabled
						>
							Send
						</button>
					</div>
				</section>
			</main>
		</div>
	);
}
