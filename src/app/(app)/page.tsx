import { CoinCarousel } from "./_components/coin-carousel";
import HeroBanner from "./_components/hero-banner";

export default function AppHomePage() {
	return (
		<div className="container mx-auto">
			<HeroBanner />

			<div className="my-12 space-y-12">
				<CoinCarousel title="🚀 Newest Drops" type="newest" />
				<CoinCarousel title="🔥 Top Gainers (24h)" type="top-gainers" />
				<CoinCarousel title="💎 Most Valuable" type="trending" />
			</div>
		</div>
	);
}
