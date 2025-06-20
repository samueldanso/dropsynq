<a href="https://synqbase.xyz">
  <img alt="SynqBase – Tokenise, Connect & Monetize your FanBase" src="https://raw.githubusercontent.com/samueldanso/SynqBase/main/public/images/banner.png">
  <h1 align="center">SynqBase</h1>
</a>

<p align="center">
SynqBase is a SocialFi music platform where artists tokenize their songs into tradable coins and monetize directly from their fans.
Built on the Zora Protocol, it allows fans to buy into the music they love, access exclusive drops, support rising talent, and earn rewards — unlocking a new way to release music as coins, reach fans, and build lasting connections — all in one platform.
</p>

## Problem

Independent artists often struggle monetizing their music without relying on middlemen. Traditional platforms like Spotify take high cuts, lack transparency, and offer no way for fans to invest in the artist’s journey. Today, fans are just passive listeners — they can’t support or benefit from an artist's rise in any meaningful way.

## Solution

SynqBase lets artists to mint thier tracks as coins and share them directly to their community. Fans can buy and hold these coins to support artist early, and unlock perks like unreleased drops, and future rewards. Artists monetize directly from their communities. Fans become real stakeholders, not just consumers.

## Features

- **Tokenized Music Drops** - Artists launch tracks as coins to monetize directly from their fans.

- **Fan Investment** - Fans buy music coins to support artists and gain exposure to their growth.

- **Revenue & Ownership Sharing** - Real value flows back to the community — no middlemen.

- **Exclusive Access** Get gated drops, early releases, and private fan experiences.

- **On-chain Social Profiles** Transparent, social engagement layer for both fans and artists.

## How it Works

### For Artists:

1. Sign up with Privy and set up a profile.
2. Upload your track and add basic metadata.
3. Mint your track as Zora coin.
4. Share the coin drop, with your fans, and get paid

### For Fans:

1. Discover new tokenized tracks from emerging artists.
2. Buy music coins to support the artists you believe in.
3. Unlock exclusive drops and releases.
4. Track your holdings and grow with the artists you support.

## Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS V4](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com/)
- **Web3 Integration**: [`@zoralabs-coins-sdk (CoinV4)`](https://docs.zora.co/coins-sdk/), [wagmi](https://wagmi.sh),[viem](https://viem.sh/)
- **Web3 Wallet & Auth**: [Privy](https://docs.privy.io/)
- **Storage**: [IPFS (Pinata)](https://www.pinata.cloud/)
- **Database**: [Supabase (Postgresql)](https://supabase.com/)
  [Drizzle ORM](https://orm.drizzle.team/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms & Validation**: [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/)
- **Notifications:** [Redis (Upstash)](https://upstash.com/)

## Zora Protocol Integration

SynqBase is built directly on top of Zora’s CoinV4 contract using the official SDK. Artists tokenize each track as a coin. This enables track ownership, tradability, and community monetization using Zora’s infrastructure.

## Project Structure

## Getting Started

### Prerequisites

- Node.js 18+
- **Package Manager**: [Bun](https://bun.sh/)
- **Formatter & Linter**: [Biome](https://biomejs.dev/)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/samueldanso/SynqBase.git
   cd SynqBase
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. Set up environment variables:

Create `.env` and add your API keys and credentials:

```bash
cp env.example .env
```

```env WALLET_PRIVATE_KEY=your_wallet_private_key
PINATA_JWT=your_pinata_jwt_secret_key
```

4. **Start the development server**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

   5. **Deploy**

   Deploy your repository to [Vercel](https://vercel.com)

## Roadmap

- [ ]

## Contributing

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Open a Pull Request

## Links

- **Live Demo**: [synqbase.xyz](https://synqbase.xyz)
