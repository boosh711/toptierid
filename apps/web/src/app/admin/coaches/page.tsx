import { prisma } from "@top-tier-id/database";

export default async function AdminCoachesPage() {
  const coaches = await prisma.coachProfile.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      college: true,
      title: true,
      isVerified: true,
      coachType: true,
      user: { select: { firstName: true, lastName: true, email: true, createdAt: true } },
    },
  });

  return (
    <>
      <h1 className="page-title">Coaches</h1>
      <p className="text-muted mb-6">{coaches.length} coach profiles</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">College</th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Verified</th>
              <th className="py-2 pr-4">Coach Type</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3 pr-4 font-medium">
                  {c.user.firstName} {c.user.lastName}
                </td>
                <td className="py-3 pr-4 text-muted">{c.user.email}</td>
                <td className="py-3 pr-4">{c.college ?? "—"}</td>
                <td className="py-3 pr-4">{c.title ?? "—"}</td>
                <td className="py-3 pr-4">
                  {c.isVerified ? (
                    <span className="text-green-600 text-xs font-medium">Yes</span>
                  ) : (
                    <span className="text-muted text-xs">No</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <span className="rounded bg-surface px-2 py-0.5 text-xs">{c.coachType}</span>
                </td>
                <td className="py-3 text-muted text-xs">
                  {c.user.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
