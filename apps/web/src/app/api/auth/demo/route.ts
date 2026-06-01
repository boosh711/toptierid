import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, roleHomePath } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.redirect(new URL("/auth/demo", req.url));
  }

  try {
    const user = await verifyCredentials(email, "demo1234");
    if (!user) {
      return NextResponse.redirect(new URL("/auth/demo?error=seed", req.url));
    }
    return NextResponse.redirect(new URL(roleHomePath(user.role), req.url));
  } catch (e) {
    console.error("[demo login]", e);
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: string }).code)
        : "";
    const msg = e instanceof Error ? e.message : "";
    const needsMigration =
      code === "P2022" ||
      msg.includes("does not exist") ||
      msg.includes("column");
    return NextResponse.redirect(
      new URL(`/auth/login?error=${needsMigration ? "migration" : "server"}`, req.url)
    );
  }
}
