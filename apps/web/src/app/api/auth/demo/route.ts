import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth";
import { roleHomePath } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.redirect(new URL("/auth/demo", req.url));
  }

  const user = await verifyCredentials(email, "demo1234");
  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/demo?error=seed", req.url)
    );
  }

  return NextResponse.redirect(new URL(roleHomePath(user.role), req.url));
}
