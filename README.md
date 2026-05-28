# TOP TIER ID — Web Prototype

Direct Connection. No Middlemen. A two-sided recruiting marketplace connecting high school athletes with college coaches.

## Stack

- **Next.js 15** (App Router) — deployable on Vercel
- **PostgreSQL** + **Prisma** — Neon or local Docker
- **Vercel Blob** (optional) — video/photo storage; falls back to `public/uploads` locally
- **Turborepo** — `apps/web`, `packages/database`, `packages/types`, `packages/validators`

## Quick start

### 1. Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Postgres)

### 2. Install

```bash
cd top-tier-id
pnpm install
cp .env.example apps/web/.env
# Also copy to packages/database for Prisma CLI
cp .env.example packages/database/.env
```

### 3. Database

```bash
docker compose up -d
pnpm db:push
pnpm db:seed
```

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

Password for all: **`demo1234`** (after `pnpm db:seed`)

| Role | Email |
|------|-------|
| Athlete | `athlete@demo.com` |
| Parent | `parent@demo.com` |
| Coach (Head) | `coach.head@demo.com` |
| Coach (Asst) | `coach.asst@demo.com` |

Quick login: [/auth/demo](http://localhost:3000/auth/demo)

Public profile example: [/p/jordan-smith](http://localhost:3000/p/jordan-smith)

## Vercel deployment

1. Create a [Neon](https://neon.tech) Postgres database
2. Create a Vercel project from this repo (root: `top-tier-id`)
3. Set environment variables:

| Variable | Required |
|----------|----------|
| `DATABASE_URL` | Yes (Neon pooled URL) |
| `SESSION_SECRET` | Yes (random 32+ chars) |
| `NEXT_PUBLIC_APP_URL` | Yes (`https://your-app.vercel.app`) |
| `BLOB_READ_WRITE_TOKEN` | Recommended for uploads |

4. Build settings:
   - **Root Directory:** `top-tier-id` (or repo root if monorepo root is `top-tier-id`)
   - **Install:** `pnpm install`
   - **Build:** `pnpm db:generate && pnpm db:push && pnpm --filter @top-tier-id/web build`
   - Run `pnpm db:seed` once via Vercel CLI or locally against production DB

5. Add `apps/web` as the Next.js app root in Vercel if needed

## Features (prototype)

### Athletes
- Multi-step onboarding & profile editor
- Public Digital ID at `/p/[slug]`
- Highlights upload (1 reel free, unlimited premium)
- Schedule with field, field #, jersey color
- Inbox, analytics (premium reveals coach names)

### Coaches
- Discover with filters
- My List, Staff Board (program notes)
- Typed + voice notes (stub transcription)
- Calendar watchlist + `.ics` export
- Contact / messaging

### Parents
- Link athlete by slug
- Supervisory dashboard, inbox, billing stub

## Stubbed integrations

OAuth, Stripe, email/SMS, Whisper transcription, Google/Apple calendar OAuth — interfaces in place; swap providers later.

## Mobile (future)

Shared `packages/types` and `packages/validators` are ready for an Expo app consuming the same API routes.

## Investor deck

See `../TOP-TIER-ID-Investor-Deck.pdf` in the parent workspace folder.
