import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { CoachAthleteActions } from "./actions-panel";

export default async function CoachAthletePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  const profile = await prisma.athleteProfile.findUnique({
    where: { slug, isPublished: true },
    include: {
      user: true,
      highlights: { orderBy: { sortOrder: "asc" } },
      scheduleEvents: { where: { startsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" } },
      collegeGoals: true,
    },
  });

  if (!profile) notFound();

  const coachProfileId = session!.coachProfileId!;
  const [favorite, notes, watches] = await Promise.all([
    prisma.coachFavorite.findUnique({
      where: {
        coachProfileId_athleteProfileId: {
          coachProfileId,
          athleteProfileId: profile.id,
        },
      },
    }),
    prisma.coachNote.findMany({
      where: { coachProfileId, athleteProfileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.calendarWatch.findMany({
      where: { coachProfileId, athleteProfileId: profile.id },
    }),
  ]);

  const watchedEventIds = new Set(watches.map((w) => w.scheduleEventId).filter(Boolean));

  return (
    <>
      <CoachNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link href="/coach" className="text-sm text-accent">← Discover</Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex gap-4">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-xl text-2xl font-bold text-white"
                  style={{ backgroundColor: profile.primaryColor }}
                >
                  {profile.user.firstName[0]}
                  {profile.user.lastName[0]}
                </div>
                <div>
                  <h1 className="font-display text-2xl">
                    {profile.user.firstName} {profile.user.lastName}
                  </h1>
                  <p className="text-muted">
                    {profile.position} · Class of {profile.gradYear} · {profile.gpa?.toFixed(2)} GPA
                  </p>
                  <p className="text-sm text-muted">
                    {profile.club} · {profile.state}
                  </p>
                  <Link href={`/p/${profile.slug}`} target="_blank" className="mt-2 inline-block text-sm text-accent">
                    Public profile ↗
                  </Link>
                </div>
              </div>
              {profile.bio && <p className="mt-4 text-muted">{profile.bio}</p>}
            </div>

            {profile.highlights.map((h) => (
              <div key={h.id} className="card">
                <p className="font-medium">{h.title}</p>
                <video src={h.url} controls className="mt-2 w-full rounded-lg" />
              </div>
            ))}

            <div className="card">
              <h2 className="font-semibold">Upcoming schedule</h2>
              <ul className="mt-4 space-y-3">
                {profile.scheduleEvents.map((e) => (
                  <li key={e.id} className="rounded-lg border border-border p-3 text-sm">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-muted">{format(e.startsAt, "EEE, MMM d · h:mm a")}</p>
                    <p className="text-muted">
                      {e.field} #{e.fieldNumber} · Jersey {e.jerseyColor}
                    </p>
                    {watchedEventIds.has(e.id) && (
                      <span className="mt-2 inline-block text-xs text-success">On your calendar</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CoachAthleteActions
            athleteProfileId={profile.id}
            slug={profile.slug}
            gradYear={profile.gradYear}
            isFavorited={!!favorite}
            scheduleEvents={profile.scheduleEvents.map((e) => ({
              id: e.id,
              title: e.title,
              onCalendar: watchedEventIds.has(e.id),
            }))}
            notes={notes}
          />
        </div>
      </main>
    </>
  );
}
