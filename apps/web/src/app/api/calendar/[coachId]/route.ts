import { prisma } from "@top-tier-id/database";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ coachId: string }> }
) {
  const { coachId } = await params;
  const watches = await prisma.calendarWatch.findMany({
    where: { coachProfileId: coachId, alertEnabled: true },
    include: {
      scheduleEvent: true,
      athleteProfile: { include: { user: true } },
    },
  });

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TOP TIER ID//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:TOP TIER ID Recruiting",
  ];

  for (const w of watches) {
    if (!w.scheduleEvent) continue;
    const start = w.scheduleEvent.startsAt;
    const end = w.scheduleEvent.endsAt ?? new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const name = w.athleteProfile.user
      ? `${w.athleteProfile.user.firstName} ${w.athleteProfile.user.lastName}`
      : "Athlete";

    lines.push(
      "BEGIN:VEVENT",
      `UID:${w.id}@toptierid.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${name} — ${w.scheduleEvent.title}`,
      `LOCATION:${[w.scheduleEvent.venue, w.scheduleEvent.field].filter(Boolean).join(" ")}`,
      `DESCRIPTION:Field ${w.scheduleEvent.fieldNumber ?? ""} · Jersey ${w.scheduleEvent.jerseyColor ?? ""}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="toptierid-recruiting.ics"',
    },
  });
}
