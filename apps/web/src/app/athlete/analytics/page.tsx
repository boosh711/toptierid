import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";

export default async function AnalyticsPage() {
  const session = await getSession();
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session!.athleteProfileId! },
    include: {
      profileViews: {
        orderBy: { createdAt: "desc" },
        include: { coachProfile: { include: { user: true } } },
      },
    },
  });

  if (!profile) return null;

  const byDay = profile.profileViews.reduce<Record<string, number>>((acc, v) => {
    const day = format(v.createdAt, "yyyy-MM-dd");
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Analytics</h1>
      <p className="text-slate-600">See who&apos;s viewing your Digital ID</p>

      {!profile.isPremium && (
        <div className="card mt-6 border-amber-200 bg-amber-50">
          <p className="font-medium text-amber-900">Free tier</p>
          <p className="text-sm text-amber-800">
            You see aggregate views only. Upgrade to Premium ($14.99/mo) to see coach names.
          </p>
        </div>
      )}

      <div className="card mt-6">
        <p className="text-3xl font-display text-brand">{profile.profileViews.length}</p>
        <p className="text-sm text-slate-600">Total profile views</p>
      </div>

      <div className="card mt-6">
        <h2 className="font-semibold">Views by day</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {Object.entries(byDay).map(([day, count]) => (
            <li key={day} className="flex justify-between">
              <span>{format(new Date(day), "MMM d, yyyy")}</span>
              <span className="font-medium">{count}</span>
            </li>
          ))}
          {Object.keys(byDay).length === 0 && (
            <li className="text-slate-500">No views recorded yet</li>
          )}
        </ul>
      </div>

      <div className="card mt-6">
        <h2 className="font-semibold">Recent viewers</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {profile.profileViews.map((v) => (
            <li key={v.id} className="flex justify-between border-b border-slate-50 py-2">
              <span>
                {profile.isPremium && v.coachProfile?.user
                  ? `${v.coachProfile.user.firstName} ${v.coachProfile.user.lastName} · ${v.coachProfile.college}`
                  : "College coach (Premium to reveal)"}
              </span>
              <span className="text-slate-400">{format(v.createdAt, "MMM d")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
