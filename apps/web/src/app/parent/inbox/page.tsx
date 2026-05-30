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
      <h1 className="page-title">Supervisory inbox</h1>
      <p className="text-muted">View conversations involving your athlete(s)</p>
      <div className="card mt-4 alert-warning text-sm text-accent">
        Approve outbound messages (stub) — toggle coming in production.
      </div>
      <ul className="mt-6 space-y-2">
        {allThreads.map((t) => {
          const last = t.messages[0];
          return (
            <li key={t.id}>
              <Link href={`/parent/inbox/${t.id}`} className="card block hover:border-accent">
                <p className="font-semibold">{t.subject ?? "Conversation"}</p>
                {last && <p className="truncate text-sm text-muted">{last.body}</p>}
                {last && <p className="text-xs text-muted">{format(last.createdAt, "MMM d")}</p>}
              </Link>
            </li>
          );
        })}
        {allThreads.length === 0 && <p className="text-muted">No messages</p>}
      </ul>
    </div>
  );
}
