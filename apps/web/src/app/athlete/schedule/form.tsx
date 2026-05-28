"use client";

import { useTransition } from "react";
import { createScheduleEvent, deleteScheduleEvent } from "@/app/actions";

export function ScheduleForm() {
  const [pending, start] = useTransition();

  return (
    <form
      className="card mt-6 grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const date = String(fd.get("date"));
        const time = String(fd.get("time"));
        const startsAt = new Date(`${date}T${time}`).toISOString();
        start(async () => {
          await createScheduleEvent({
            title: String(fd.get("title")),
            startsAt,
            opponent: String(fd.get("opponent") || "") || undefined,
            venue: String(fd.get("venue") || "") || undefined,
            field: String(fd.get("field") || "") || undefined,
            fieldNumber: String(fd.get("fieldNumber") || "") || undefined,
            jerseyColor: String(fd.get("jerseyColor") || "") || undefined,
            tournamentName: String(fd.get("tournamentName") || "") || undefined,
          });
          e.currentTarget.reset();
        });
      }}
    >
      <h2 className="font-semibold md:col-span-2">Add game / event</h2>
      <input name="title" placeholder="Event title" className="input" required />
      <input name="tournamentName" placeholder="Tournament name" className="input" />
      <input name="date" type="date" className="input" required />
      <input name="time" type="time" className="input" required />
      <input name="opponent" placeholder="Opponent" className="input" />
      <input name="venue" placeholder="Venue" className="input" />
      <input name="field" placeholder="Field" className="input" />
      <input name="fieldNumber" placeholder="Field #" className="input" />
      <input name="jerseyColor" placeholder="Jersey color" className="input" />
      <button type="submit" disabled={pending} className="btn-primary md:col-span-2">
        Add to schedule
      </button>
    </form>
  );
}
