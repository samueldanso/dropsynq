export function UpcomingDrops() {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="max-w-md mx-auto">
				{/* Icon */}
				<div className="flex justify-center mb-4">
					<div className="size-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
						<svg
							className="size-8 text-primary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>

				{/* Title */}
				<h3 className="text-lg font-semibold mb-2">Upcoming Drops</h3>

				{/* Description */}
				<p className="text-muted-foreground mb-6 text-sm leading-relaxed">
					Schedule and preview your upcoming releases. Build anticipation with
					your fans before your drops go live.
				</p>

				{/* Feature Coming Soon Badge */}
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
					<span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
					Feature coming soon
				</div>

				{/* Additional Info */}
				<div className="mt-6 text-xs text-muted-foreground space-y-1">
					<p>🎵 Schedule future releases</p>
					<p>🔔 Notify your fans</p>
					<p>📊 Build anticipation</p>
				</div>
			</div>
		</div>
	);
}
