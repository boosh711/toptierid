import Link from "next/link";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { getThreadsForAthlete } from "@/lib/messaging";

export default async function ParentInboxPage() {
  const session = await getSession();
  const links = await prisma.parentLink.findMany({
    where: { parentUserId: session!.id },
    include: { athleteProfile: true },
  });

  const allThreads = [];
  for (const link of links) {
    const threads = await getThreadsForAthlete(link.athleteProfileId);
    allThreads.push(...threads.map((t) => ({ ...t, athleteName: link.athleteProfile.slug })));
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Supervisory inbox</h1>
      <p className="text-slate-600">View conversations involving your athlete(s)</p>
      <div className="card mt-4 border-amber-200 bg-amber-50 text-sm text-amber-900">
        Approve outbound messages (stub) — toggle coming in production.
      </div>
      <ul className="mt-6 space-y-2">
        {allThreads.map((t) => {
          const last = t.messages[0];
          return (
            <li key={t.id}>
              <Link href={`/parent/inbox/${t.id}`} className="card block hover:border-brand">
                <p className="font-semibold">{t.subject ?? "Conversation"}</p>
                {last && <p className="truncate text-sm text-slate-600">{last.body}</p>}
                {last && <p className="text-xs text-slate-400">{format(last.createdAt, "MMM d")}</p>}
              </Link>
            </li>
          );
        })}
        {allThreads.length === 0 && <p className="text-slate-500">No messages</p>}
      </ul>
    </div>
  );
}
