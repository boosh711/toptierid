import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { format } from "date-fns";
import { ScheduleForm } from "./form";

export default async function SchedulePage() {
  const session = await getSession();
  const events = await prisma.scheduleEvent.findMany({
    where: { athleteProfileId: session!.athleteProfileId! },
    orderBy: { startsAt: "asc" },
  });

  return (
    <div>
      <h1 className="page-title">Schedule</h1>
      <p className="text-muted">Games, tournaments, field info, and jersey color for coaches</p>
      <ScheduleForm />
      <ul className="mt-8 space-y-3">
        {events.map((e) => (
          <li key={e.id} className="card text-sm">
            <p className="font-semibold">{e.title}</p>
            <p className="text-muted">{format(e.startsAt, "EEE, MMM d · h:mm a")}</p>
            <p className="mt-1 text-muted">
              {e.tournamentName && `${e.tournamentName} · `}
              {e.opponent && `vs ${e.opponent} · `}
              {e.venue} · {e.field} #{e.fieldNumber} · Jersey: {e.jerseyColor}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
