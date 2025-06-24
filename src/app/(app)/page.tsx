import { CoinCarousel } from "./_components/coin-carousel";
import HeroSection from "./_components/hero-section";

export default function AppHomePage() {
	return (
		<div className="container mx-auto">
			<HeroSection />

			<div className="my-12 space-y-12">
				<CoinCarousel title="🚀 Newest Drops" type="newest" />
				<CoinCarousel title="🔥 Top Gainers (24h)" type="top-gainers" />
				<CoinCarousel title="💎 Most Valuable" type="most-valuable" />
				<CoinCarousel title="📈 Top Volume (24h)" type="top-volume" />
			</div>
		</div>
	);
}
