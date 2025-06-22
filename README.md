<a href="https://synqbase.xyz">
  <img alt="SynqBase – Tokenise, Connect & Monetize your FanBase" src="https://raw.githubusercontent.com/samueldanso/SynqBase/main/public/images/banner.png">
  <h1 align="center">SynqBase</h1>
</a>

<p align="center">
SynqBase is a SocialFi music platform where artists launch tokenized songs as tradable coins and earn directly from fans. Built on Zora, it lets fans discover, trade, support rising talent, and share in the upside — creating a new way to connect and grow through music.
</p>

## Problem

Artists struggle to monetize directly, with traditonal streaming platforms taking large cuts and offering little control and ownership. Fans have no direct way to invest in or own the music they love, or share in artists' success — they're just passive listeners.

## Solution

SynqBase enables artists to mint their songs as tokenized music coins on Zora, providing direct-to-fan monetization. Fans can discover, buy, trade, and collect songs as assets while sharing in the upside — creating a new music economy where both artists and fans benefit.

## Features

- **Tokenized Song Drops** - Artists can launch their songs as tokenized music coins to earn directly from their fans — no middlemen.
- **Buy, Trade & Own Music Coins** - Fans can invest in songs they love and directly support artists they believe in.
- **Built-In Royalties and Rewards** - Automated and transparent earnings for artists, plus perks, early drops, and exclusive content for fans.
- **Artists & Fan Profiles** - Track releases, collections, follow and build real connections between fans and artists.
- **Asset Portfolio Tracking** - Track your holdings, activity and grow your valuable digital asset collections.
- **Seamless Onboarding** - Easily sign in with your wallet for a smooth user experience — powered by Privy.

## How it Works

### For Artists:

1. Sign up with Privy and set up your profile.
2. Upload your track and add metadata.
3. Mint your song as tokenised coin on Zora.
4. Launch your drop with your fans, and monitize your music

### For Fans:

1. Discover unique music and new drops from your favorite artists.
2. Buy music coins to directly support artists you believe in.
3. Build real coonection wih artist communities anf follow your favorites.
4. Track your holdings, gain your music asset collection, and potentially gain value.

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

SynqBase is built directly on top of Zora’s CoinV4 contract using the official SDK. Artists tokenize each song as a coin. This enables track ownership, tradability, and community monetization using Zora’s infrastructure.

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
