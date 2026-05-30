import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";

export default async function ParentProfilePage() {
  const session = await getSession();
  const links = await prisma.parentLink.findMany({
    where: { parentUserId: session!.id },
    include: { athleteProfile: { include: { user: true, collegeGoals: true } } },
  });

  return (
    <div>
      <h1 className="page-title">Athlete profile oversight</h1>
      <p className="text-muted">Read-only preview — suggest edits to your athlete</p>
      {links.map((l) => {
        const a = l.athleteProfile;
        return (
          <div key={l.id} className="card mt-6">
            <h2 className="font-semibold">
              {a.user.firstName} {a.user.lastName}
            </h2>
            <dl className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              <div><dt className="text-muted">Position</dt><dd>{a.position}</dd></div>
              <div><dt className="text-muted">Grad year</dt><dd>{a.gradYear}</dd></div>
              <div><dt className="text-muted">GPA</dt><dd>{a.gpa}</dd></div>
              <div><dt className="text-muted">Club</dt><dd>{a.club}</dd></div>
              <div className="md:col-span-2"><dt className="text-muted">Bio</dt><dd>{a.bio}</dd></div>
            </dl>
            <Link href={`/p/${a.slug}`} className="mt-4 inline-block text-sm text-accent">
              View public page →
            </Link>
            <p className="mt-4 text-xs text-muted">
              Suggest changes (stub): contact your athlete to update their Digital ID.
            </p>
          </div>
        );
      })}
    </div>
  );
}
