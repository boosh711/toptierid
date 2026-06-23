import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStorageProvider, uploadProfilePhoto } from "@/lib/storage";
import { prisma } from "@top-tier-id/database";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const MAX_CREST_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.athleteProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (file.size > MAX_CREST_BYTES) {
    return NextResponse.json({ error: "Image must be under 2 MB." }, { status: 400 });
  }

  try {
    // Reuse the same upload pipeline as profile photos
    const { url } = await uploadProfilePhoto(file);

    const profile = await prisma.athleteProfile.update({
      where: { id: session.athleteProfileId },
      data: { clubCrestUrl: url },
    });

    revalidatePath("/athlete/profile");
    revalidatePath(`/p/${profile.slug}`);

    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed. Try again." },
      { status: 500 }
    );
  }
}
