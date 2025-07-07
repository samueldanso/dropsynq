"use client";

import { useState } from "react";
import { CoinCarousel } from "./_components/coin-carousel";
import GenreFilter from "./_components/genre-filter";
import HeroBanner from "./_components/hero-banner";

export default function AppHomePage() {
  // State for active genre (ready for future integration)
  const [activeGenre, setActiveGenre] = useState("All");

  // Handler for HeroBanner Explore button (stub for now)
  function handleExploreClick() {
    // e.g., set a trending tab, scroll, or log
    // console.log("Explore Trending clicked");
  }

  return (
    <div>
      <HeroBanner onExploreClick={handleExploreClick} />
      <div className="mt-8 mb-12">
        <GenreFilter activeGenre={activeGenre} onGenreChange={setActiveGenre} />
      </div>
      <div className="my-12 space-y-12">
        <CoinCarousel title="🚀 Newest Drops" type="newest" />
        <CoinCarousel title="🔥 Top Gainers (24h)" type="top-gainers" />
        <CoinCarousel title="💎 Most Valuable" type="trending" />
      </div>
    </div>
  );
}
