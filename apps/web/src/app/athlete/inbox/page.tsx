import Link from "next/link";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { getThreadsForAthlete } from "@/lib/messaging";

export default async function AthleteInboxPage() {
  const session = await getSession();
  const threads = await getThreadsForAthlete(session!.athleteProfileId!);

  return (
    <div>
      <h1 className="page-title">Inbox</h1>
      <p className="text-muted">Messages from college coaches</p>
      <ul className="mt-6 space-y-2">
        {threads.length === 0 ? (
          <li className="card text-sm text-muted">No messages yet</li>
        ) : (
          threads.map((t) => {
            const last = t.messages[0];
            return (
              <li key={t.id}>
                <Link href={`/athlete/inbox/${t.id}`} className="card block hover:border-brand">
                  <p className="font-semibold">{t.subject ?? "Conversation"}</p>
                  {last && (
                    <p className="mt-1 truncate text-sm text-muted">
                      {last.sender.firstName}: {last.body}
                    </p>
                  )}
                  {last && (
                    <p className="mt-1 text-xs text-muted">
                      {format(last.createdAt, "MMM d, h:mm a")}
                    </p>
                  )}
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
