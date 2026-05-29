#!/usr/bin/env bash
# Seed the SAME database Vercel uses (not local docker).
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE="apps/web/.env.production.local"

echo "→ Pulling Production env from Vercel (requires: vercel login + vercel link in apps/web)..."
cd apps/web
if ! command -v vercel &>/dev/null; then
  echo "Install Vercel CLI: npm i -g vercel"
  exit 1
fi
vercel env pull "$ENV_FILE" --environment=production --yes
cd ../..

if ! grep -q '^DATABASE_URL=' "$ENV_FILE"; then
  echo "ERROR: DATABASE_URL not found in $ENV_FILE"
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

echo "→ Target host: $(echo "$DATABASE_URL" | sed -E 's|.*@([^/]+)/.*|\1|')"
echo "→ Pushing schema..."
pnpm db:push
echo "→ Seeding demo users..."
pnpm db:seed

echo ""
echo "Done. Check https://toptierid-web.vercel.app/api/health — userCount should be > 0."
