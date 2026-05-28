import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { prisma, NoteVisibility } from "@top-tier-id/database";

export default async function StaffBoardPage() {
  const session = await getSession();
  const coach = await prisma.coachProfile.findUnique({
    where: { id: session!.coachProfileId! },
    include: { program: true },
  });

  const programNotes = coach?.programId
    ? await prisma.coachNote.findMany({
        where: { programId: coach.programId, visibility: NoteVisibility.PROGRAM },
        include: {
          athleteProfile: { include: { user: true } },
          coachProfile: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <>
      <CoachNav active="/coach/staff" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl text-navy">Staff Board</h1>
        <p className="text-slate-600">
          {coach?.program
            ? `${coach.program.name} — shared program notes`
            : "Join a program to collaborate with staff"}
        </p>

        {!coach?.programId && (
          <div className="card mt-6">
            <p className="text-sm text-slate-600">
              Demo: log in as <code>coach.head@demo.com</code> or <code>coach.asst@demo.com</code> for program workspace.
            </p>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4">Athlete</th>
                <th className="py-2 pr-4">Coach</th>
                <th className="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {programNotes.map((n) => (
                <tr key={n.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">
                    {n.athleteProfile.user.firstName} {n.athleteProfile.user.lastName}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {n.coachProfile.user.firstName} {n.coachProfile.user.lastName}
                  </td>
                  <td className="py-3">{n.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {programNotes.length === 0 && coach?.programId && (
            <p className="mt-4 text-slate-500">No program-visible notes yet. Share notes from athlete profiles.</p>
          )}
        </div>
      </main>
    </>
  );
}
