import { prisma, ensureDatabaseUrl, databaseEnvStatus } from "@top-tier-id/database";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = ensureDatabaseUrl();
  const env = databaseEnvStatus();

  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        error: "No database URL found in environment variables",
        hint:
          "In Vercel → Settings → Environment Variables, add DATABASE_URL with your Neon pooled connection string. If you used Vercel Storage, it may have created POSTGRES_PRISMA_URL — redeploy after this update and it will be picked up automatically.",
        envVarsPresent: env.configured,
        envVarsChecked: [
          "DATABASE_URL",
          "POSTGRES_PRISMA_URL",
          "POSTGRES_URL",
          "POSTGRES_URL_NON_POOLING",
        ],
      },
      { status: 500 }
    );
  }

  try {
    const count = await prisma.user.count();
    return NextResponse.json({
      ok: true,
      database: "connected",
      userCount: count,
      envSource: env.configured[0],
      hint:
        count === 0
          ? "Database is empty — run pnpm db:push && pnpm db:seed locally with the same connection string"
          : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown database error";
    console.error("[health]", e);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        envSource: env.configured[0],
        hint: "Check Neon connection string (use pooled URL) and run pnpm db:push && pnpm db:seed",
      },
      { status: 500 }
    );
  }
}
