import Link from "next/link";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { getThreadsForAthlete } from "@/lib/messaging";

export default async function AthleteInboxPage() {
  const session = await getSession();
  const threads = await getThreadsForAthlete(session!.athleteProfileId!);

  return (
    <div>
      <h1 className="font-display text-2xl text-navy">Inbox</h1>
      <p className="text-slate-600">Messages from college coaches</p>
      <ul className="mt-6 space-y-2">
        {threads.length === 0 ? (
          <li className="card text-sm text-slate-500">No messages yet</li>
        ) : (
          threads.map((t) => {
            const last = t.messages[0];
            return (
              <li key={t.id}>
                <Link href={`/athlete/inbox/${t.id}`} className="card block hover:border-brand">
                  <p className="font-semibold">{t.subject ?? "Conversation"}</p>
                  {last && (
                    <p className="mt-1 truncate text-sm text-slate-600">
                      {last.sender.firstName}: {last.body}
                    </p>
                  )}
                  {last && (
                    <p className="mt-1 text-xs text-slate-400">
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
