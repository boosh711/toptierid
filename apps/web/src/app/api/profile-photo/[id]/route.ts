import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@top-tier-id/database";
import { parseDataUrl } from "@/lib/profile-photo";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await prisma.athleteProfile.findUnique({
    where: { id },
    select: { photoUrl: true, updatedAt: true },
  });

  if (!profile?.photoUrl) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { photoUrl } = profile;

  if (photoUrl.startsWith("data:")) {
    const parsed = parseDataUrl(photoUrl);
    if (!parsed) return new NextResponse("Invalid photo", { status: 500 });
    return new NextResponse(parsed.buffer, {
      headers: {
        "Content-Type": parsed.mime,
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  }

  if (photoUrl.startsWith("/uploads/")) {
    try {
      const filePath = path.join(process.cwd(), "public", photoUrl);
      const buffer = await readFile(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  return NextResponse.redirect(photoUrl, 302);
}
