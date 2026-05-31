import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveAthleteProfilePhoto } from "@/lib/profile-photo-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.athleteProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a photo to upload." }, { status: 400 });
  }

  try {
    const { displayUrl } = await saveAthleteProfilePhoto(session.athleteProfileId, file);
    return NextResponse.json({ ok: true, url: displayUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed. Try again.",
      },
      { status: 500 }
    );
  }
}
