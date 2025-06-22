import HeroBanner from "./_components/hero-banner";

export default function HomePage() {
	return (
		<div className="space-y-4 p-4">
			<HeroBanner />
			<h1 className="font-bold text-2xl">Discover Feed</h1>
			<p className="text-muted-foreground">
				This is the main feed. It's public, but actions are protected.
			</p>
		</div>
	);
}
