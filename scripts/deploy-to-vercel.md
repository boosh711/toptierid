# Deploy TOP TIER ID to Vercel (GitHub-connected)

Your code is committed locally in `top-tier-id/`. Follow these steps once (about 10 minutes).

## 1. Push to GitHub

On [github.com/new](https://github.com/new), create a repository named **`top-tier-id`** (private or public).

Then in Terminal:

```bash
cd "/Users/bryandell/Documents/Top Tier ID/top-tier-id"
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/top-tier-id.git
git push -u origin main
```

(Use the HTTPS URL instead of SSH if you prefer: `https://github.com/YOUR_GITHUB_USERNAME/top-tier-id.git`)

## 2. Create a Neon database (free)

1. Go to [neon.tech](https://neon.tech) and create a project.
2. Copy the **pooled** connection string (`postgresql://...?sslmode=require`).

## 3. Import project in Vercel

1. Open [vercel.com/new](https://vercel.com/new).
2. **Import** the `top-tier-id` GitHub repository.
3. Configure:

| Setting | Value |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Framework Preset** | Next.js |
| **Build Command** | *(leave default — uses `apps/web/vercel.json`)* |
| **Install Command** | *(leave default)* |

4. **Environment variables** (Production + Preview):

| Name | Value |
|------|--------|
| `DATABASE_URL` | Your Neon pooled URL |
| `SESSION_SECRET` | Random string, 32+ characters |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR_PROJECT.vercel.app` (update after first deploy) |

5. Click **Deploy**.

## 4. Initialize the database (once)

After the first successful deploy, from your machine:

```bash
cd "/Users/bryandell/Documents/Top Tier ID/top-tier-id"
export DATABASE_URL="your-neon-url"
pnpm install
pnpm db:push
pnpm db:seed
```

Or run the same commands in the **Neon SQL editor** is not applicable — use local CLI against production `DATABASE_URL`.

## 5. Optional: Vercel Blob (video uploads)

1. In the Vercel project → **Storage** → create a **Blob** store.
2. Connect it to the project; Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.

## 6. Redeploy & test

1. Update `NEXT_PUBLIC_APP_URL` to your final `.vercel.app` URL if needed.
2. **Redeploy** from the Vercel dashboard.
3. Visit `/auth/demo` and quick-login with `athlete@demo.com` / `demo1234`.

---

## CLI alternative (if you prefer)

```bash
npm i -g vercel
vercel login
cd "/Users/bryandell/Documents/Top Tier ID/top-tier-id/apps/web"
vercel link
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel --prod
```

Then run `pnpm db:push` and `pnpm db:seed` with `DATABASE_URL` set locally.
