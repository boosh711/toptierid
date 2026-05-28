import { format } from "date-fns";
import { BRAND } from "@top-tier-id/types";

type Highlight = { id: string; title: string; url: string; thumbnailUrl?: string | null };
type Event = {
  id: string;
  title: string;
  startsAt: Date;
  opponent?: string | null;
  venue?: string | null;
  field?: string | null;
  fieldNumber?: string | null;
  jerseyColor?: string | null;
  tournamentName?: string | null;
};

type Props = {
  firstName: string;
  lastName: string;
  slug: string;
  position?: string | null;
  gradYear?: number | null;
  gpa?: number | null;
  club?: string | null;
  highSchool?: string | null;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  highlights: Highlight[];
  events: Event[];
  divisions: string[];
  regions: string[];
  targetSchools: string[];
};

export function PublicProfileView(props: Props) {
  const {
    firstName,
    lastName,
    position,
    gradYear,
    gpa,
    club,
    highSchool,
    city,
    state,
    bio,
    photoUrl,
    primaryColor,
    secondaryColor,
    highlights,
    events,
    divisions,
    regions,
    targetSchools,
  } = props;

  return (
    <div className="min-h-screen" style={{ backgroundColor: secondaryColor }}>
      <header
        className="px-4 py-10 text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div
            className="mb-4 flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white/30 text-3xl font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              `${firstName[0]}${lastName[0]}`
            )}
          </div>
          <p className="font-display text-sm uppercase tracking-widest opacity-80">Digital ID</p>
          <h1 className="font-display text-4xl">
            {firstName} {lastName}
          </h1>
          <p className="mt-2 text-lg opacity-90">
            {position} · Class of {gradYear}
            {gpa != null && ` · ${gpa.toFixed(2)} GPA`}
          </p>
          <p className="mt-1 opacity-80">
            {club}
            {highSchool && ` · ${highSchool}`}
            {(city || state) && ` · ${[city, state].filter(Boolean).join(", ")}`}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        {bio && (
          <section className="card">
            <h2 className="mb-2 font-display text-lg text-brand">About</h2>
            <p className="text-slate-700">{bio}</p>
          </section>
        )}

        {highlights.length > 0 && (
          <section className="card">
            <h2 className="mb-4 font-display text-lg text-brand">Highlights</h2>
            <div className="space-y-4">
              {highlights.map((h) => (
                <div key={h.id}>
                  <p className="mb-2 font-medium">{h.title}</p>
                  <video
                    src={h.url}
                    controls
                    className="w-full rounded-lg bg-black"
                    preload="metadata"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section className="card">
            <h2 className="mb-4 font-display text-lg text-brand">Upcoming Schedule</h2>
            <ul className="space-y-3">
              {events.map((e) => (
                <li key={e.id} className="rounded-lg border border-slate-100 p-3">
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-slate-600">
                    {format(new Date(e.startsAt), "EEE, MMM d · h:mm a")}
                  </p>
                  {e.tournamentName && (
                    <p className="text-sm text-brand">{e.tournamentName}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {e.opponent && (
                      <span className="rounded bg-slate-100 px-2 py-1">vs {e.opponent}</span>
                    )}
                    {e.field && (
                      <span className="rounded bg-slate-100 px-2 py-1">{e.field}</span>
                    )}
                    {e.fieldNumber && (
                      <span className="rounded bg-slate-100 px-2 py-1">#{e.fieldNumber}</span>
                    )}
                    {e.jerseyColor && (
                      <span className="rounded bg-slate-100 px-2 py-1">Jersey: {e.jerseyColor}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(divisions.length > 0 || regions.length > 0 || targetSchools.length > 0) && (
          <section className="card">
            <h2 className="mb-4 font-display text-lg text-brand">College Goals</h2>
            {divisions.length > 0 && (
              <p className="text-sm">
                <span className="font-medium">Divisions:</span> {divisions.join(", ")}
              </p>
            )}
            {regions.length > 0 && (
              <p className="mt-2 text-sm">
                <span className="font-medium">Regions:</span> {regions.join(", ")}
              </p>
            )}
            {targetSchools.length > 0 && (
              <p className="mt-2 text-sm">
                <span className="font-medium">Target schools:</span> {targetSchools.join(", ")}
              </p>
            )}
          </section>
        )}

        <footer className="pb-8 text-center text-xs text-slate-400">
          {BRAND.tagline} · Powered by TOP TIER ID
        </footer>
      </main>
    </div>
  );
}
