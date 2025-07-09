# DropSynq

A SocialFi music platform where artists launch tokenized songs as tradable coins and earn directly from fans. It lets fans discover, trade, support rising talent, and share in the upside — creating a new way to connect and grow through music. Built on Zora.

## Problem

Artists struggle to monetize directly — traditional streaming platforms take large cuts and offer little control or ownership.
Fans have no direct way to invest in or own the music they love, or share in artists' success — they're just passive listeners.

## Solution

DropSynq enables artists to mint their songs as tokenized music coins on Zora, unlocking direct-to-fan monetization.
Fans can discover, buy, trade, and collect songs as assets — creating a new music economy where both artists and fans benefit.

## Features

- **🎵 Tokenized Song Drops** - Launch songs as music coins and earn directly from your fans.
- **💱 Trade & Own Music Coins** - Fans can invest in songs they love and directly support artists they believe in.
- **💰 Royalties and Rewards** - Artists earn automatically. Fans get early access, exclusive content, and upside.
- **👥 Artists & Fan Profiles** - Showcase drops, collections, and build real connections between fans and artists.
- **📊 Asset Portfolio Tracking** - View your holdings, activity, and build a valuable music asset collection.
- **💼 Seamless Onboarding** - Simple, secure login with wallets — powered by Privy.

## How it Works

### For Artists:

1. Sign up with Privy and set up your artist profile.
2. Upload your song and add metadata.
3. Mint it as a coin using Zora Protocol.
4. Launch your drop, earn from your fans, and grow your community.

### For Fans:

1. Discover exclusive music drops and rising artists.
2. Buy song coins to support artists you love
3. Follow, engage, and connect with creators.
4. Track your music assets and share in the upside.

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
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## Zora Coins-SDK Integration

DropSynq is built directly on top of Zora's CoinV4 contract using the official SDK. Here's how we leverage the Zora Coins SDK throughout the platform:

### 🪙 **Core SDK Functions Used**

**Create Functions:**

- **`createCoin`** - Artists mint songs as ERC20 coins with metadata

**Get Functions:**

- **`getCoin`** - Fetch individual coin details and metadata
- **`getCoinsNew`** - Latest coin drops for homepage and search
- **`getCoinsTopGainers`** - Trending coins for artist discovery
- **`getCoinsMostValuable`** - Highest-value coins for charts
- **`getProfile`** - Fetch user profiles by handle or wallet address
- **`getProfileBalances`** - Get user's coin holdings and portfolio
- **`getProfileCoins`** - Display coins created by the user

**Trade Functions:**

- **`tradeCoin`** - Buy/sell coins with ETH using TradeParameters
- **`TradeParameters`** - Configure trade direction, amounts, slippage

### 📍 **Where Each Function is Used**

**`createCoin`** - `/create` page for minting song coins
**`getCoin`** - Track details page and homepage coin enrichment
**`getCoinsNew`** - Homepage discovery and search functionality
**`getCoinsTopGainers`** - Artists page and trending discovery
**`getCoinsMostValuable`** - Homepage charts and discovery
**`tradeCoin`** - Buy button and trade card components
**`getProfile`** - Profile pages, header, sidebar, and API routes
**`getProfileBalances`** - Profile portfolio and collections
**`getProfileCoins`** - Profile created coins tab

This integration enables a complete music economy where artists can tokenize their work, fans can invest in music they love, and everyone benefits from the growing ecosystem.

## Project Structure

```
src/
├── app/
│   ├── (app)/
│   │   ├── create/          # Song coin minting
│   │   ├── profile/         # User profiles & portfolios
│   │   ├── track/           # Individual track pages
│   │   ├── artists/         # Artist discovery
│   │   └── page.tsx         # Homepage with discovery
│   └── api/
│       ├── songs/           # Song management APIs
│       └── profile/         # Profile data APIs
├── components/
│   ├── shared/              # Reusable components
│   ├── layout/              # App layout components
│   └── ui/                  # Shadcn UI components
├── lib/
│   ├── zora.ts             # Zora SDK configuration
│   └── pinata.ts           # IPFS upload utilities
├── types/
│   └── zora.ts             # Zora SDK type definitions
└── hooks/                  # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js 18+
- **Package Manager**: [Bun](https://bun.sh/)
- **Formatter & Linter**: [Biome](https://biomejs.dev/)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/samueldanso/dropsynq.git
   cd dropsynq
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

```env
NEXT_PUBLIC_APP_URL="your_app_url"
NEXT_PUBLIC_PRIVY_APP_ID="your_privy_app_id"
PRIVY_APP_SECRET="your_privy_app_secret"
PINATA_JWT="your_pinata_jwt"
NEXT_PUBLIC_GATEWAY_URL="your_pinata_gateway_url"
DATABASE_URL="your_database_url"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_KEY="your_supabase_secret_key"
ZORA_API_KEY="your_zora_api_key"
```

4. **Start the development server**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

   5. **Deploy**

   Deploy your repository to [Vercel](https://vercel.com)

## Contributing

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Open a Pull Request

## Links

- **Live Demo**: [dropsynq.vercel.app](https://dropsynq.vercel.app)
