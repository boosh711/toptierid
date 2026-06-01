import { revalidatePath } from "next/cache";
import { prisma } from "@top-tier-id/database";
import { getProfilePhotoUrl } from "./profile-photo";
import { uploadProfilePhoto } from "./storage";

export async function saveAthleteProfilePhoto(athleteProfileId: string, file: File) {
  const { url: storedUrl } = await uploadProfilePhoto(file);
  const profile = await prisma.athleteProfile.update({
    where: { id: athleteProfileId },
    data: {
      photoUrl: storedUrl,
      photoPositionX: 50,
      photoPositionY: 22,
      onboardingStep: { increment: 1 },
    },
  });

  revalidatePath("/athlete");
  revalidatePath("/athlete/profile");
  revalidatePath(`/p/${profile.slug}`);

  const displayUrl = getProfilePhotoUrl(profile.id, storedUrl, profile.updatedAt.getTime());
  return { profile, displayUrl: displayUrl! };
}
