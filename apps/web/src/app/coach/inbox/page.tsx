import Link from "next/link";
import { format } from "date-fns";
import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { getThreadsForCoach } from "@/lib/messaging";

export default async function CoachInboxPage() {
  const session = await getSession();
  const threads = await getThreadsForCoach(session!.id);

  return (
    <>
      <CoachNav active="/coach/inbox" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="page-title">Inbox</h1>
        <ul className="mt-6 space-y-2">
          {threads.map((t) => {
            const athlete = t.participants.find((p) => p.athleteProfile)?.athleteProfile;
            const last = t.messages[0];
            return (
              <li key={t.id}>
                <Link href={`/coach/inbox/${t.id}`} className="card block hover:border-accent">
                  <p className="font-semibold">
                    {athlete?.user
                      ? `${athlete.user.firstName} ${athlete.user.lastName}`
                      : t.subject}
                  </p>
                  {last && (
                    <p className="mt-1 truncate text-sm text-muted">{last.body}</p>
                  )}
                  {last && (
                    <p className="text-xs text-muted">{format(last.createdAt, "MMM d")}</p>
                  )}
                </Link>
              </li>
            );
          })}
          {threads.length === 0 && <p className="text-muted">No conversations yet</p>}
        </ul>
      </main>
    </>
  );
}
