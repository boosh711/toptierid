import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";

export default async function CoachProgramPage() {
  const session = await getSession();
  const coach = await prisma.coachProfile.findUnique({
    where: { id: session!.coachProfileId! },
    include: {
      program: { include: { memberships: { include: { coachProfile: { include: { user: true } } } } } },
    },
  });

  return (
    <>
      <CoachNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="page-title">Program workspace</h1>
        {coach?.program ? (
          <div className="card mt-6">
            <h2 className="font-semibold">{coach.program.name}</h2>
            <p className="text-muted">{coach.program.college}</p>
            <h3 className="mt-6 font-medium">Staff</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {coach.program.memberships.map((m) => (
                <li key={m.id}>
                  {m.coachProfile.user.firstName} {m.coachProfile.user.lastName} — {m.role}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Invite staff (stub): email invites coming soon — College Program $299/mo tier.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-muted">You are not assigned to a program workspace.</p>
        )}
      </main>
    </>
  );
}
