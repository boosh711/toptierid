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
      <h1 className="font-display text-2xl text-navy">Athlete profile oversight</h1>
      <p className="text-slate-600">Read-only preview — suggest edits to your athlete</p>
      {links.map((l) => {
        const a = l.athleteProfile;
        return (
          <div key={l.id} className="card mt-6">
            <h2 className="font-semibold">
              {a.user.firstName} {a.user.lastName}
            </h2>
            <dl className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              <div><dt className="text-slate-500">Position</dt><dd>{a.position}</dd></div>
              <div><dt className="text-slate-500">Grad year</dt><dd>{a.gradYear}</dd></div>
              <div><dt className="text-slate-500">GPA</dt><dd>{a.gpa}</dd></div>
              <div><dt className="text-slate-500">Club</dt><dd>{a.club}</dd></div>
              <div className="md:col-span-2"><dt className="text-slate-500">Bio</dt><dd>{a.bio}</dd></div>
            </dl>
            <Link href={`/p/${a.slug}`} className="mt-4 inline-block text-sm text-brand">
              View public page →
            </Link>
            <p className="mt-4 text-xs text-slate-500">
              Suggest changes (stub): contact your athlete to update their Digital ID.
            </p>
          </div>
        );
      })}
    </div>
  );
}
