import { PrismaClient } from "@prisma/client";
import { ensureDatabaseUrl } from "./resolve-database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const url = ensureDatabaseUrl();
  if (!url) {
    console.error(
      "[prisma] No database URL found. Set DATABASE_URL (or connect Vercel Postgres/Neon storage)."
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
export { resolveDatabaseUrl, ensureDatabaseUrl, databaseEnvStatus } from "./resolve-database-url";
