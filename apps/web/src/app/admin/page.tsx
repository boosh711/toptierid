import { prisma } from "@top-tier-id/database";

export default async function AdminDashboardPage() {
  const [roleCounts, publishedAthletes, messageCount, contactRequestCount] = await Promise.all([
    prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
    prisma.athleteProfile.count({ where: { isPublished: true } }),
    prisma.message.count(),
    prisma.contactRequest.count(),
  ]);

  const byRole: Record<string, number> = {};
  for (const r of roleCounts) {
    byRole[r.role] = r._count.id;
  }

  const stats = [
    { label: "Athletes", value: byRole["ATHLETE"] ?? 0 },
    { label: "Parents", value: byRole["PARENT"] ?? 0 },
    { label: "Coaches", value: byRole["COACH"] ?? 0 },
    { label: "Published Profiles", value: publishedAthletes },
    { label: "Messages", value: messageCount },
    { label: "Contact Requests", value: contactRequestCount },
  ];

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="text-muted mb-6">Platform overview</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="text-muted text-sm">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
