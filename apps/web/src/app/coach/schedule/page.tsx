import { format } from "date-fns";
import { CoachNav } from "@/components/nav-coach";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { CalendarSyncPanel } from "./sync-panel";

export default async function CoachSchedulePage() {
  const session = await getSession();
  const coachId = session!.coachProfileId!;

  const watches = await prisma.calendarWatch.findMany({
    where: { coachProfileId: coachId },
    include: {
      scheduleEvent: true,
      athleteProfile: { include: { user: true } },
    },
    orderBy: { scheduleEvent: { startsAt: "asc" } },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const icsUrl = `${appUrl}/api/calendar/${coachId}`;

  return (
    <>
      <CoachNav active="/coach/schedule" />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl text-navy">Recruiting calendar</h1>
        <p className="text-slate-600">Games you&apos;re watching — sync to iPhone or Google Calendar</p>

        <CalendarSyncPanel icsUrl={icsUrl} />

        <ul className="mt-8 space-y-3">
          {watches.map((w) => {
            if (!w.scheduleEvent) return null;
            const e = w.scheduleEvent;
            const name = `${w.athleteProfile.user.firstName} ${w.athleteProfile.user.lastName}`;
            return (
              <li key={w.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-brand">{e.title}</p>
                    <p className="text-sm text-slate-600">
                      {format(e.startsAt, "EEE, MMM d · h:mm a")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {e.venue} · {e.field} #{e.fieldNumber} · Jersey {e.jerseyColor}
                    </p>
                  </div>
                  {w.alertEnabled && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                      Alert on
                    </span>
                  )}
                </div>
              </li>
            );
          })}
          {watches.length === 0 && (
            <li className="card text-slate-500">
              No watched games — open an athlete profile and add events to your calendar.
            </li>
          )}
        </ul>
      </main>
    </>
  );
}
