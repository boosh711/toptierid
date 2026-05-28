import { notFound } from "next/navigation";
import { prisma } from "@top-tier-id/database";
import { PublicProfileView } from "@/components/public-profile";
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
      gpa={profile.gpa}
      club={profile.club}
      highSchool={profile.highSchool}
      city={profile.city}
      state={profile.state}
      bio={profile.bio}
      photoUrl={profile.photoUrl}
      primaryColor={profile.primaryColor}
      secondaryColor={profile.secondaryColor}
      highlights={profile.highlights}
      events={profile.scheduleEvents}
      divisions={profile.collegeGoals?.divisions ?? []}
      regions={profile.collegeGoals?.regions ?? []}
      targetSchools={profile.collegeGoals?.targetSchools ?? []}
    />
  );
}
