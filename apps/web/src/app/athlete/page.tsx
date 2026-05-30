import Link from "next/link";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";

export default async function AthleteHomePage() {
  const session = await getSession();
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session!.athleteProfileId! },
    include: {
      scheduleEvents: { orderBy: { startsAt: "asc" }, take: 3 },
      highlights: true,
      profileViews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { coachProfile: { include: { user: true } } },
      },
      collegeGoals: true,
    },
  });

  if (!profile) return <p>Profile not found</p>;

  const checklist = [
    { done: !!profile.position, label: "Add position & stats" },
    { done: !!profile.photoUrl, label: "Upload profile photo" },
    { done: profile.highlights.length > 0, label: "Add highlight reel" },
    { done: profile.scheduleEvents.length > 0, label: "Enter upcoming schedule" },
    { done: profile.isPublished, label: "Publish your Digital ID" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const views = profile.profileViews;
  const showCoachNames = profile.isPremium;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">
          Hey, {session!.firstName}
        </h1>
        <p className="text-muted">Your recruiting command center</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-lg text-brand-light">Profile completion</h2>
          <div className="mt-3 h-2 rounded-full bg-surface-elevated">
            <div
              className="h-2 rounded-full bg-brand"
              style={{ width: `${(doneCount / checklist.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-muted">
            {doneCount}/{checklist.length} complete
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {checklist.map((c) => (
              <li key={c.label} className={c.done ? "text-success" : "text-muted"}>
                {c.done ? "✓" : "○"} {c.label}
              </li>
            ))}
          </ul>
          {profile.onboardingStep < 6 && (
            <Link href="/athlete/onboarding" className="btn-primary mt-4 inline-block text-sm">
              Continue setup
            </Link>
          )}
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-brand-light">Coach interest</h2>
          {!showCoachNames && (
            <p className="mt-2 text-xs text-brand-light">
              Upgrade to Premium to see which coaches viewed your profile.
            </p>
          )}
          {views.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No views yet — share your link!</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {views.map((v) => (
                <li key={v.id} className="flex justify-between border-b border-border py-2">
                  <span>
                    {showCoachNames && v.coachProfile?.user
                      ? `${v.coachProfile.user.firstName} ${v.coachProfile.user.lastName}`
                      : "A college coach"}
                  </span>
                  <span className="text-muted">
                    {format(v.createdAt, "MMM d")}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/athlete/analytics" className="mt-3 inline-block text-sm text-brand-light">
            View analytics →
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-light">Upcoming games</h2>
          <Link href="/athlete/schedule" className="text-sm text-brand-light">
            Manage schedule
          </Link>
        </div>
        {profile.scheduleEvents.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No events scheduled</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {profile.scheduleEvents.map((e) => (
              <li key={e.id} className="rounded-lg border border-border p-3 text-sm">
                <p className="font-semibold">{e.title}</p>
                <p className="text-muted">{format(e.startsAt, "EEE, MMM d · h:mm a")}</p>
                <p className="text-muted">
                  {e.field} {e.fieldNumber && `#${e.fieldNumber}`} · Jersey: {e.jerseyColor}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {profile.isPublished && (
        <div className="card border-brand bg-brand/10">
          <p className="font-medium">Your public link</p>
          <code className="mt-2 block rounded bg-surface px-3 py-2 text-brand-light">
            /p/{profile.slug}
          </code>
        </div>
      )}
    </div>
  );
}
