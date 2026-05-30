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
  heightInches?: number | null;
  club?: string | null;
  highSchool?: string | null;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  highlights: Highlight[];
  events: Event[];
  divisions: string[];
  regions: string[];
  targetSchools: string[];
  compact?: boolean;
};

function formatHeight(inches: number | null | undefined) {
  if (!inches) return "—";
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}

export function PublicProfileView(props: Props) {
  const {
    firstName,
    lastName,
    position,
    gradYear,
    gpa,
    heightInches,
    club,
    highSchool,
    bio,
    photoUrl,
    highlights,
    events,
    divisions,
    regions,
    targetSchools,
    compact = false,
  } = props;

  const fullName = `${firstName} ${lastName}`.toUpperCase();
  const subtitle = [position, gradYear ? `CLASS OF ${gradYear}` : null]
    .filter(Boolean)
    .join(" • ");

  return (
    <div
      className={`bg-profile-gradient text-white ${compact ? "rounded-xl border border-border" : "min-h-screen"}`}
    >
      {/* Hero header */}
      <header className="relative overflow-hidden px-4 pb-6 pt-8">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className={`relative mx-auto ${compact ? "max-w-full" : "max-w-lg"}`}>
          <div className="mb-6 flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Digital ID
            </p>
            <span className="font-display text-5xl leading-none text-accent">9</span>
          </div>

          <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-border-strong bg-surface-elevated">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-center text-xs text-muted">
                Add Your
                <br />
                Photo
              </span>
            )}
          </div>

          <div className="mb-4 flex justify-center">
            <span className="badge-verified">✓ Verified Athlete</span>
          </div>

          <h1 className="text-center font-display text-3xl tracking-wide">{fullName}</h1>
          {subtitle && (
            <p className="mt-2 text-center text-xs font-semibold uppercase tracking-widest text-muted">
              {subtitle}
            </p>
          )}
          {(club || highSchool) && (
            <p className="mt-2 text-center text-sm text-muted">
              {[club, highSchool].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </header>

      {/* Stats bar */}
      <div className="border-y border-border bg-surface/80">
        <div className={`mx-auto grid grid-cols-4 divide-x divide-border ${compact ? "max-w-full" : "max-w-lg"}`}>
          {[
            { label: "GPA", value: gpa != null ? gpa.toFixed(1) : "—" },
            { label: "Height", value: formatHeight(heightInches) },
            { label: "Position", value: position ?? "—" },
            { label: "Class", value: gradYear?.toString() ?? "—" },
          ].map((stat) => (
            <div key={stat.label} className="px-2 py-4 text-center">
              <p className="stat-value text-xl">{stat.value}</p>
              <p className="stat-label mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className={`mx-auto space-y-6 px-4 py-8 ${compact ? "max-w-full" : "max-w-lg"}`}>
        {bio && (
          <section>
            <h2 className="section-heading">About</h2>
            <p className="text-sm leading-relaxed text-muted">{bio}</p>
          </section>
        )}

        {highlights.length > 0 && (
          <section>
            <h2 className="section-heading">Highlights</h2>
            <div className="space-y-4">
              {highlights.map((h) => (
                <div key={h.id}>
                  <p className="mb-2 text-sm font-medium text-white">{h.title}</p>
                  <video
                    src={h.url}
                    controls
                    className="w-full rounded-lg border border-border bg-black"
                    preload="metadata"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section>
            <h2 className="section-heading">Schedule</h2>
            <ul className="space-y-3">
              {events.map((e) => (
                <li key={e.id} className="card-elevated text-sm">
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="text-muted">
                    {format(new Date(e.startsAt), "EEE, MMM d · h:mm a")}
                  </p>
                  {e.tournamentName && (
                    <p className="text-accent">{e.tournamentName}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {e.opponent && <span className="tag">vs {e.opponent}</span>}
                    {e.field && <span className="tag">{e.field}</span>}
                    {e.fieldNumber && <span className="tag">#{e.fieldNumber}</span>}
                    {e.jerseyColor && <span className="tag">Jersey: {e.jerseyColor}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(divisions.length > 0 || regions.length > 0 || targetSchools.length > 0) && (
          <section>
            <h2 className="section-heading">College Goals</h2>
            <div className="space-y-2 text-sm text-muted">
              {divisions.length > 0 && (
                <p>
                  <span className="text-white">Divisions:</span> {divisions.join(", ")}
                </p>
              )}
              {regions.length > 0 && (
                <p>
                  <span className="text-white">Regions:</span> {regions.join(", ")}
                </p>
              )}
              {targetSchools.length > 0 && (
                <p>
                  <span className="text-white">Targets:</span> {targetSchools.join(", ")}
                </p>
              )}
            </div>
          </section>
        )}

        {!compact && (
          <footer className="pb-8 text-center text-xs text-muted">
            {BRAND.tagline} · TOP TIER ID
          </footer>
        )}
      </main>
    </div>
  );
}
