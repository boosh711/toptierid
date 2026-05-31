import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { searchAthletes } from "@/lib/search";
import { AthleteProfileCard } from "@/components/athlete-profile-card";
import { getProfilePhotoUrl } from "@/lib/profile-photo";
import { prisma } from "@top-tier-id/database";
import { Suspense } from "react";
import { DiscoverFilters } from "./discover-filters";

export default async function CoachDiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const session = await getSession();
  const { items, total, page, totalPages } = await searchAthletes({
    q: sp.q,
    position: sp.position,
    gradYear: sp.gradYear ? Number(sp.gradYear) : undefined,
    gpaMin: sp.gpaMin ? Number(sp.gpaMin) : undefined,
    state: sp.state,
    club: sp.club,
    page: sp.page ? Number(sp.page) : 1,
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const viewsThisWeek = session?.coachProfileId
    ? await prisma.profileView.count({
        where: { coachProfileId: session.coachProfileId, createdAt: { gte: weekAgo } },
      })
    : 0;

  return (
    <>
      <CoachNav active="/coach" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="page-title">Discover athletes</h1>
            <p className="text-muted">{total} players · {viewsThisWeek} profiles viewed this week</p>
          </div>
        </div>

        <Suspense fallback={<div className="card mt-6 h-24 animate-pulse bg-surface-elevated" />}>
          <DiscoverFilters />
        </Suspense>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <AthleteProfileCard
              key={a.id}
              slug={a.slug}
              firstName={a.user.firstName}
              lastName={a.user.lastName}
              position={a.position}
              gradYear={a.gradYear}
              club={a.club}
              state={a.state}
              gpa={a.gpa}
              photoUrl={getProfilePhotoUrl(a.id, a.photoUrl, a.updatedAt.getTime())}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 10).map((p) => (
              <a
                key={p}
                href={`/coach?page=${p}`}
                className={`rounded px-3 py-1 text-sm ${p === page ? "bg-brand text-white" : "bg-surface"}`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
