import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { AthleteProfileCard } from "@/components/athlete-profile-card";

export default async function CoachListPage() {
  const session = await getSession();
  const favorites = await prisma.coachFavorite.findMany({
    where: { coachProfileId: session!.coachProfileId! },
    include: {
      athleteProfile: { include: { user: true, notes: { where: { coachProfileId: session!.coachProfileId }, take: 1, orderBy: { createdAt: "desc" } } } },
    },
  });

  return (
    <>
      <CoachNav active="/coach/list" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl text-navy">My List</h1>
        <p className="text-slate-600">Saved athletes</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <div key={f.id}>
              <AthleteProfileCard
                slug={f.athleteProfile.slug}
                firstName={f.athleteProfile.user.firstName}
                lastName={f.athleteProfile.user.lastName}
                position={f.athleteProfile.position}
                gradYear={f.athleteProfile.gradYear}
                club={f.athleteProfile.club}
                state={f.athleteProfile.state}
                gpa={f.athleteProfile.gpa}
                primaryColor={f.athleteProfile.primaryColor}
                photoUrl={f.athleteProfile.photoUrl}
              />
              {f.athleteProfile.notes[0] && (
                <p className="mt-2 truncate text-xs text-slate-500 italic">
                  Note: {f.athleteProfile.notes[0].body}
                </p>
              )}
            </div>
          ))}
          {favorites.length === 0 && (
            <p className="text-slate-500">No saved athletes — use Discover to add favorites.</p>
          )}
        </div>
      </main>
    </>
  );
}
