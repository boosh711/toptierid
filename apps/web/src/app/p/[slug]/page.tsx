import { notFound } from "next/navigation";
import { prisma } from "@top-tier-id/database";
import { PublicProfileView } from "@/components/public-profile";
import { getProfilePhotoUrl } from "@/lib/profile-photo";
import { getSession } from "@/lib/auth";
import { recordProfileView } from "@/app/actions";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await prisma.athleteProfile.findUnique({
    where: { slug, isPublished: true },
    include: {
      user: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      scheduleEvents: {
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 10,
      },
      collegeGoals: true,
    },
  });

  if (!profile) notFound();

  const session = await getSession();
  if (session?.coachProfileId || !session) {
    await recordProfileView(profile.id);
  }

  return (
    <PublicProfileView
      firstName={profile.user.firstName}
      lastName={profile.user.lastName}
      slug={profile.slug}
      position={profile.position}
      gradYear={profile.gradYear}
      heightInches={profile.heightInches}
      highSchool={profile.highSchool}
      city={profile.city}
      state={profile.state}
      bio={profile.bio}
      photoUrl={getProfilePhotoUrl(profile.id, profile.photoUrl, profile.updatedAt.getTime())}
      primaryColor={profile.primaryColor}
      secondaryColor={profile.secondaryColor}
      accentColor={profile.accentColor}
      highlights={profile.highlights}
      events={profile.scheduleEvents}
      divisions={profile.collegeGoals?.divisions ?? []}
      regions={profile.collegeGoals?.regions ?? []}
      targetSchools={profile.collegeGoals?.targetSchools ?? []}
      socialLinks={{
        instagramUrl: profile.instagramUrl,
        tiktokUrl: profile.tiktokUrl,
        youtubeUrl: profile.youtubeUrl,
        hudlUrl: profile.hudlUrl,
        xUrl: profile.xUrl,
      }}
    />
  );
}
