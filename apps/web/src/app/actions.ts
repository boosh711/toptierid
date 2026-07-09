"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}
import { prisma, NoteVisibility } from "@top-tier-id/database";
import {
  getSession,
  registerUser,
  verifyCredentials,
  destroySession,
  canCoachContactAthlete,
} from "@/lib/auth";
import { getStorageProvider } from "@/lib/storage";
import { saveAthleteProfilePhoto } from "@/lib/profile-photo-server";
import { normalizeSocialLinks } from "@/lib/social-links";
import {
  athleteBasicsSchema,
  profileStyleSchema,
  slugSchema,
  collegeGoalsSchema,
  socialLinksSchema,
  photoPositionSchema,
  scheduleEventSchema,
  coachNoteSchema,
  messageSchema,
} from "@top-tier-id/validators";

export async function loginAction(formData: FormData) {
  try {
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const user = await verifyCredentials(email, password);
    if (!user) redirect("/auth/login?error=invalid");
    redirect(
      user.role === "ATHLETE"
        ? "/athlete"
        : user.role === "COACH"
          ? "/coach"
          : "/parent"
    );
  } catch (e) {
    if (isRedirectError(e)) throw e;
    console.error("[loginAction]", e);
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: string }).code)
        : "";
    const msg = e instanceof Error ? e.message : "";
    const needsMigration =
      code === "P2022" ||
      msg.includes("does not exist") ||
      msg.includes("column");
    redirect(`/auth/login?error=${needsMigration ? "migration" : "server"}`);
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const role = String(formData.get("role")) as "ATHLETE" | "PARENT" | "COACH";
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const coachType = String(formData.get("coachType") || "single");

  try {
    const user = await registerUser({ email, password, role, firstName, lastName, coachType });
    if (role === "ATHLETE") redirect("/athlete/onboarding");
    redirect(
      role === "COACH" ? "/coach" : "/parent"
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Signup failed";
    redirect(`/auth/signup?error=${encodeURIComponent(msg)}`);
  }
}

export async function quickLoginAction(email: string) {
  const user = await verifyCredentials(email, "demo1234");
  if (!user) return { error: "Demo account not found. Run db:seed first." };
  redirect(
    user.role === "ATHLETE"
      ? "/athlete"
      : user.role === "COACH"
        ? "/coach"
        : "/parent"
  );
}

export async function updateAthleteBasics(data: unknown) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = athleteBasicsSchema.parse(data);

  await prisma.athleteProfile.update({
    where: { id: session.athleteProfileId },
    data: {
      ...parsed,
      onboardingStep: { increment: 1 },
    },
  });
  revalidatePath("/athlete");
  return { ok: true };
}

export async function updateProfileStyle(data: unknown) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = profileStyleSchema.parse(data);
  const profile = await prisma.athleteProfile.update({
    where: { id: session.athleteProfileId },
    data: parsed,
  });
  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
  revalidatePath(`/p/${profile.slug}`);
  return { ok: true };
}

export async function updateSlug(slug: string) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = slugSchema.parse(slug);
  const existing = await prisma.athleteProfile.findUnique({ where: { slug: parsed } });
  if (existing && existing.id !== session.athleteProfileId) {
    return { error: "This URL is already taken" };
  }
  await prisma.athleteProfile.update({
    where: { id: session.athleteProfileId },
    data: { slug: parsed, isPublished: true, onboardingStep: 6 },
  });
  revalidatePath("/athlete");
  revalidatePath(`/p/${parsed}`);
  return { ok: true, slug: parsed };
}

export async function updatePhotoPosition(data: unknown) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = photoPositionSchema.parse(data);

  const profile = await prisma.athleteProfile.update({
    where: { id: session.athleteProfileId },
    data: {
      photoPositionX: parsed.photoPositionX,
      photoPositionY: parsed.photoPositionY,
      photoScale: parsed.photoScale,
    },
  });

  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
  revalidatePath(`/p/${profile.slug}`);
  return { ok: true };
}

export async function updateSocialLinks(data: unknown) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = socialLinksSchema.parse(data);
  const normalized = normalizeSocialLinks(parsed);

  const profile = await prisma.athleteProfile.update({
    where: { id: session.athleteProfileId },
    data: {
      instagramUrl: normalized.instagramUrl,
      tiktokUrl: normalized.tiktokUrl,
      youtubeUrl: normalized.youtubeUrl,
      hudlUrl: normalized.hudlUrl,
      xUrl: normalized.xUrl,
    },
  });

  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
  revalidatePath(`/p/${profile.slug}`);
  return { ok: true, links: normalized };
}

export async function updateCollegeGoals(data: unknown) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = collegeGoalsSchema.parse(data);
  await prisma.collegeGoals.upsert({
    where: { athleteProfileId: session.athleteProfileId },
    create: { athleteProfileId: session.athleteProfileId, ...parsed },
    update: parsed,
  });
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session.athleteProfileId },
  });
  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
  if (profile) revalidatePath(`/p/${profile.slug}`);
  return { ok: true };
}

export async function uploadPhoto(formData: FormData) {
  const session = await getSession();
  if (!session?.athleteProfileId) return { error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file?.size) return { error: "Choose a photo to upload." };

  try {
    const { displayUrl } = await saveAthleteProfilePhoto(session.athleteProfileId, file);
    return { ok: true as const, url: displayUrl };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed. Try again.",
    };
  }
}

export async function uploadHighlight(formData: FormData) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session.athleteProfileId },
    include: { highlights: true },
  });
  if (!profile) throw new Error("Profile not found");
  if (!profile.isPremium && profile.highlights.length >= 1) {
    return { error: "Free tier allows 1 highlight. Upgrade to Premium for unlimited reels." };
  }

  const file = formData.get("file") as File;
  const title = String(formData.get("title") || "Highlight");
  if (!file?.size) throw new Error("No file");

  const storage = getStorageProvider();
  const { url, sizeBytes } = await storage.upload(file, "highlights");

  await prisma.highlight.create({
    data: {
      athleteProfileId: session.athleteProfileId,
      title,
      url,
      sizeBytes,
      mimeType: file.type,
      sortOrder: profile.highlights.length,
    },
  });
  revalidatePath("/athlete/highlights");
  revalidatePath("/athlete");
  return { ok: true };
}

export async function deleteHighlight(id: string) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  await prisma.highlight.deleteMany({
    where: { id, athleteProfileId: session.athleteProfileId },
  });
  revalidatePath("/athlete/highlights");
  return { ok: true };
}

export async function createScheduleEvent(data: unknown) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const parsed = scheduleEventSchema.parse(data);
  await prisma.scheduleEvent.create({
    data: {
      athleteProfileId: session.athleteProfileId,
      title: parsed.title,
      startsAt: new Date(parsed.startsAt),
      endsAt: parsed.endsAt ? new Date(parsed.endsAt) : null,
      opponent: parsed.opponent,
      venue: parsed.venue,
      field: parsed.field,
      fieldNumber: parsed.fieldNumber,
      jerseyColor: parsed.jerseyColor,
      tournamentName: parsed.tournamentName,
    },
  });
  revalidatePath("/athlete/schedule");
  return { ok: true };
}

export async function deleteScheduleEvent(id: string) {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  await prisma.scheduleEvent.deleteMany({
    where: { id, athleteProfileId: session.athleteProfileId },
  });
  revalidatePath("/athlete/schedule");
  return { ok: true };
}

export async function toggleFavorite(athleteProfileId: string) {
  const session = await getSession();
  if (!session?.coachProfileId) throw new Error("Unauthorized");
  const existing = await prisma.coachFavorite.findUnique({
    where: {
      coachProfileId_athleteProfileId: {
        coachProfileId: session.coachProfileId,
        athleteProfileId,
      },
    },
  });
  if (existing) {
    await prisma.coachFavorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.coachFavorite.create({
      data: { coachProfileId: session.coachProfileId, athleteProfileId },
    });
  }
  revalidatePath("/coach");
  return { ok: true };
}

export async function saveCoachNote(data: unknown) {
  const session = await getSession();
  if (!session?.coachProfileId) throw new Error("Unauthorized");
  const parsed = coachNoteSchema.parse(data);
  const coach = await prisma.coachProfile.findUnique({
    where: { id: session.coachProfileId },
  });

  await prisma.coachNote.create({
    data: {
      coachProfileId: session.coachProfileId,
      athleteProfileId: parsed.athleteProfileId,
      body: parsed.body,
      visibility: parsed.visibility as NoteVisibility,
      programId:
        parsed.visibility === "PROGRAM" ? coach?.programId ?? undefined : undefined,
    },
  });
  revalidatePath(`/coach/athlete`);
  return { ok: true };
}

export async function saveVoiceNote(formData: FormData) {
  const session = await getSession();
  if (!session?.coachProfileId) throw new Error("Unauthorized");
  const athleteProfileId = String(formData.get("athleteProfileId"));
  const file = formData.get("audio") as File;
  const visibility = (String(formData.get("visibility") || "PRIVATE") as NoteVisibility);

  let audioUrl: string | undefined;
  if (file?.size) {
    const storage = getStorageProvider();
    const result = await storage.upload(file, "voice-notes");
    audioUrl = result.url;
  }

  const transcript =
    "[Stub transcript] Strong technical ability observed. Good positioning in transition. Follow up at showcase.";

  await prisma.coachNote.create({
    data: {
      coachProfileId: session.coachProfileId,
      athleteProfileId,
      body: transcript,
      visibility,
      audioUrl,
      transcript,
    },
  });
  revalidatePath(`/coach/athlete`);
  return { ok: true, transcript };
}

export async function addCalendarWatch(scheduleEventId: string, athleteProfileId: string) {
  const session = await getSession();
  if (!session?.coachProfileId) throw new Error("Unauthorized");
  await prisma.calendarWatch.upsert({
    where: {
      coachProfileId_scheduleEventId: {
        coachProfileId: session.coachProfileId,
        scheduleEventId,
      },
    },
    create: {
      coachProfileId: session.coachProfileId,
      athleteProfileId,
      scheduleEventId,
      alertEnabled: true,
    },
    update: { alertEnabled: true },
  });
  revalidatePath("/coach/schedule");
  return { ok: true };
}

export async function contactAthlete(athleteProfileId: string, message: string) {
  const session = await getSession();
  if (!session?.coachProfileId) throw new Error("Unauthorized");

  const athlete = await prisma.athleteProfile.findUnique({
    where: { id: athleteProfileId },
    include: { user: true },
  });
  if (!athlete) throw new Error("Athlete not found");

  if (!canCoachContactAthlete(session.role, athlete.gradYear)) {
    return { error: "NCAA stub: Cannot contact athletes this far from graduation year." };
  }

  await prisma.contactRequest.create({
    data: {
      coachProfileId: session.coachProfileId,
      athleteProfileId,
      message,
      status: "pending",
    },
  });

  let thread = await prisma.messageThread.findFirst({
    where: {
      participants: { some: { athleteProfileId } },
      messages: { some: { senderId: session.id } },
    },
  });

  if (!thread) {
    thread = await prisma.messageThread.create({
      data: {
        subject: "Recruiting message",
        participants: { create: [{ athleteProfileId }] },
      },
    });
  }

  await prisma.message.create({
    data: { threadId: thread.id, senderId: session.id, body: message },
  });

  console.log("[ContactService stub] Notify athlete/parent:", athlete.user.email);
  revalidatePath("/coach");
  revalidatePath("/athlete/inbox");
  return { ok: true };
}

export async function sendMessage(data: unknown) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const parsed = messageSchema.parse(data);

  await prisma.message.create({
    data: {
      threadId: parsed.threadId,
      senderId: session.id,
      body: parsed.body,
    },
  });
  revalidatePath("/athlete/inbox");
  revalidatePath("/parent/inbox");
  revalidatePath("/coach/inbox");
  return { ok: true };
}

export async function recordProfileView(athleteProfileId: string) {
  const session = await getSession();
  await prisma.profileView.create({
    data: {
      athleteProfileId,
      coachProfileId: session?.coachProfileId,
      viewerUserId: session?.id,
      isAnonymous: !session,
    },
  });
}

export async function toggleProfileVisibility() {
  const session = await getSession();
  if (!session?.athleteProfileId) throw new Error("Unauthorized");
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session.athleteProfileId },
    select: { isVisible: true },
  });
  if (!profile) throw new Error("Profile not found");
  const updated = await prisma.athleteProfile.update({
    where: { id: session.athleteProfileId },
    data: { isVisible: !profile.isVisible },
  });
  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
}

export async function linkParentByCode(code: string) {
  const session = await getSession();
  if (!session || session.role !== "PARENT") throw new Error("Unauthorized");
  const athlete = await prisma.athleteProfile.findUnique({ where: { slug: code.trim() } });
  if (!athlete) return { error: "Invalid invite code (use athlete slug)" };
  await prisma.parentLink.upsert({
    where: {
      parentUserId_athleteProfileId: {
        parentUserId: session.id,
        athleteProfileId: athlete.id,
      },
    },
    create: { parentUserId: session.id, athleteProfileId: athlete.id },
    update: {},
  });
  revalidatePath("/parent");
  return { ok: true };
}
