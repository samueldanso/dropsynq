import { CoinCarousel } from "./_components/coin-carousel";
import HeroBanner from "./_components/hero-banner";

export default function AppHomePage() {
	return (
		<div className="mx-auto max-w-7xl px-4">
			<div className="rounded-2xl bg-muted/80 shadow-lg p-8 mt-6 mb-6">
				<HeroBanner />

				<div className="my-12 space-y-12">
					<CoinCarousel title="🚀 Newest Drops" type="newest" />
					<CoinCarousel title="🔥 Top Gainers (24h)" type="top-gainers" />
					<CoinCarousel title="💎 Most Valuable" type="trending" />
				</div>
			</div>
		</div>
	);
}
