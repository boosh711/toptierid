import { prisma } from "@top-tier-id/database";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        error: "DATABASE_URL is not set in environment variables",
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
      hint:
        count === 0
          ? "Database is empty — run pnpm db:seed against this DATABASE_URL"
          : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown database error";
    console.error("[health]", e);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        hint: "Check Neon connection string (use pooled URL) and run pnpm db:push && pnpm db:seed",
      },
      { status: 500 }
    );
  }
}
