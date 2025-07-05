export default function DropsPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-3xl font-bold mb-4">Upcoming Drops</h1>
					<p className="text-muted-foreground text-lg">
						Discover and get notified about upcoming music releases from your
						favorite artists
					</p>
				</div>

				{/* Placeholder Content */}
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="max-w-md mx-auto">
						{/* Icon */}
						<div className="flex justify-center mb-6">
							<div className="size-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
								<svg
									className="size-10 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
						</div>

						{/* Title */}
						<h2 className="text-xl font-semibold mb-3">
							Global Drops Discovery
						</h2>

						{/* Description */}
						<p className="text-muted-foreground mb-6 text-sm leading-relaxed">
							Browse upcoming releases from all artists, RSVP to get notified,
							and never miss a drop from your favorite creators.
						</p>

						{/* Feature Coming Soon Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
							<span className="size-2 rounded-full bg-primary animate-pulse"></span>
							Feature coming soon
						</div>

						{/* Features List */}
						<div className="text-xs text-muted-foreground space-y-2">
							<div className="flex items-center gap-2">
								<span>🎵</span>
								<span>Browse upcoming releases</span>
							</div>
							<div className="flex items-center gap-2">
								<span>🔔</span>
								<span>RSVP and get notified</span>
							</div>
							<div className="flex items-center gap-2">
								<span>👥</span>
								<span>Discover new artists</span>
							</div>
							<div className="flex items-center gap-2">
								<span>📊</span>
								<span>Track release schedules</span>
							</div>
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center mt-12">
					<p className="text-sm text-muted-foreground mb-4">
						Want to be the first to know when this feature launches?
					</p>
					<button
						type="button"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
					>
						<span>Follow DropSynq</span>
						<svg
							className="size-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
