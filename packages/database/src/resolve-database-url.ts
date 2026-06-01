/** Vercel/Neon integrations often use POSTGRES_* instead of DATABASE_URL */
const DATABASE_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

export function resolveDatabaseUrl(): string | undefined {
  for (const key of DATABASE_ENV_KEYS) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

/** Prisma schema reads DATABASE_URL — map Vercel Neon vars before connecting */
export function ensureDatabaseUrl(): string | undefined {
  const url = resolveDatabaseUrl();
  if (url) {
    process.env.DATABASE_URL = url;
  }
  return url;
}

/** Prefer a direct connection for schema changes (Neon/Vercel). */
export function ensureMigrateDatabaseUrl(): string | undefined {
  const migrateKeys = [
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL",
  ] as const;
  for (const key of migrateKeys) {
    const value = process.env[key];
    if (value) {
      process.env.DATABASE_URL = value;
      return value;
    }
  }
  return undefined;
}

export function databaseEnvStatus() {
  return {
    configured: DATABASE_ENV_KEYS.filter((k) => !!process.env[k]),
    missing: DATABASE_ENV_KEYS.filter((k) => !process.env[k]),
  };
}
