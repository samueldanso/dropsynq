"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

// This component will be a hero/banner section for the top of the feed.
export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h1 className="font-bold text-4xl text-foreground leading-tight md:text-5xl">
            Turn music into coins. Discover, trade, and earn.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Launch tokenized songs and connect with fans — or explore music
            coins from rising artists. All on Zora.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 font-bold text-white hover:opacity-90"
            >
              Explore
            </Button>
          </div>
        </div>
        <div className="relative hidden h-64 md:block md:h-full">
          <Image
            src="/images/cover.png"
            alt="Artist performing on stage"
            layout="fill"
            objectFit="cover"
            className="rounded-r-xl"
          />
        </div>
      </div>
    </div>
  );
}
