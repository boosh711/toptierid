import { prisma } from "@top-tier-id/database";

export default async function AdminAthletesPage() {
  const athletes = await prisma.athleteProfile.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      sport: true,
      gradYear: true,
      isPublished: true,
      isVisible: true,
      createdAt: true,
      user: { select: { firstName: true, lastName: true } },
    },
  });

  return (
    <>
      <h1 className="page-title">Athletes</h1>
      <p className="text-muted mb-6">{athletes.length} athlete profiles</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Sport</th>
              <th className="py-2 pr-4">Grad Year</th>
              <th className="py-2 pr-4">Published</th>
              <th className="py-2 pr-4">Visible</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((a) => (
              <tr key={a.id} className="border-b border-border">
                <td className="py-3 pr-4 font-medium">
                  {a.user.firstName} {a.user.lastName}
                </td>
                <td className="py-3 pr-4 text-muted font-mono text-xs">{a.slug}</td>
                <td className="py-3 pr-4">{a.sport}</td>
                <td className="py-3 pr-4">{a.gradYear ?? "—"}</td>
                <td className="py-3 pr-4">
                  {a.isPublished ? (
                    <span className="text-green-600 text-xs font-medium">Yes</span>
                  ) : (
                    <span className="text-muted text-xs">No</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {a.isVisible ? (
                    <span className="text-green-600 text-xs font-medium">Yes</span>
                  ) : (
                    <span className="text-muted text-xs">No</span>
                  )}
                </td>
                <td className="py-3 text-muted text-xs">
                  {a.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
