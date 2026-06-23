import { format } from "date-fns";
import { BRAND } from "@top-tier-id/types";
import type { SocialLinks } from "@/lib/social-links";
import { SocialConnect } from "@/components/social-connect";
import {
  HERO_FRAME_CLASS,
  type PhotoPosition,
  parsePhotoPosition,
  photoObjectPosition,
} from "@/lib/profile-hero";

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
  goalsScored?: number | null;
  assists?: number | null;
  club?: string | null;
  highSchool?: string | null;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  photoPositionX?: number | null;
  photoPositionY?: number | null;
  photoScale?: number | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string | null;
  highlights: Highlight[];
  events: Event[];
  divisions: string[];
  regions: string[];
  targetSchools: string[];
  socialLinks?: SocialLinks;
  compact?: boolean;
};

function formatHeight(inches: number | null | undefined) {
  if (!inches) return "—";
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-display text-sm uppercase tracking-widest" style={{ color: accent }}>
      <span className="h-0.5 w-6 shrink-0" style={{ backgroundColor: accent }} />
      {children}
    </h2>
  );
}

export function PublicProfileView(props: Props) {
  const {
    firstName,
    lastName,
    position,
    gradYear,
    gpa,
    heightInches,
    goalsScored,
    assists,
    club,
    highSchool,
    bio,
    photoUrl,
    photoPositionX,
    photoPositionY,
    photoScale,
    primaryColor = "#1E6BD6",
    secondaryColor = "#0B1F3A",
    accentColor,
    highlights,
    events,
    divisions,
    regions,
    targetSchools,
    socialLinks = {},
    compact = false,
  } = props;

  const accent = accentColor || primaryColor;
  const bg = secondaryColor;

  const fullName = `${firstName} ${lastName}`.toUpperCase();
  const subtitle = [position, gradYear ? `CLASS OF ${gradYear}` : null]
    .filter(Boolean)
    .join(" • ");

  const photoPosition = parsePhotoPosition(photoPositionX, photoPositionY);
  const scale = photoScale ?? 1;
  const heroLayout = compact ? HERO_FRAME_CLASS.compact : HERO_FRAME_CLASS.full;

  return (
    <div
      className={`text-white ${compact ? "" : "min-h-screen"}`}
      style={{ background: bg }}
    >
      {/* Centered portrait card — max 480px, matches editor crop aspect */}
      <div className={compact ? "" : "mx-auto max-w-[480px]"}>
      <div
        className={`text-white ${compact ? "overflow-hidden rounded-xl border border-border" : ""}`}
        style={{
          background: `linear-gradient(180deg, ${bg} 0%, ${bg}cc 60%, ${bg} 100%)`,
        }}
      >
      <header className={`relative overflow-hidden ${heroLayout}`}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            className="absolute inset-0 h-full w-full select-none"
            style={{
              objectFit: "cover",
              transform: `translate(${((50 - photoPosition.x) * scale).toFixed(2)}%, ${((50 - photoPosition.y) * scale).toFixed(2)}%) scale(${scale})`,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${accent}44 0%, ${bg} 50%, #050508 100%)`,
            }}
          />
        )}

        {/* Clean bottom fade — just darkness, no color tinting */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,0) 40%,
              rgba(0,0,0,0.6) 70%,
              rgba(0,0,0,0.92) 90%,
              rgba(0,0,0,1) 100%
            )`,
          }}
        />

        {!compact && (
          <p className="absolute left-4 top-4 z-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Digital ID
          </p>
        )}

        <span
          className={`absolute right-4 z-10 font-display leading-none ${compact ? "top-3 text-4xl" : "top-4 text-6xl sm:text-7xl"}`}
          style={{ color: accent }}
        >
          9
        </span>

        <div
          className={`absolute bottom-0 left-0 right-0 z-10 ${compact ? "p-3" : "p-4 pb-5 sm:p-5 sm:pb-6"} ${compact ? "" : "mx-auto max-w-lg"}`}
        >
          <h1
            className={`font-display uppercase leading-[0.95] tracking-wide text-white ${
              compact ? "text-xl" : "text-3xl sm:text-4xl"
            }`}
          >
            {firstName}
            <br />
            {lastName.toUpperCase()}
          </h1>
          {subtitle && (
            <p
              className={`mt-2 font-semibold uppercase tracking-widest ${
                compact ? "text-[10px]" : "text-xs"
              }`}
              style={{ color: accent }}
            >
              {subtitle}
            </p>
          )}
          <div className="mt-3">
            <span className="badge-verified">✓ Verified Athlete</span>
          </div>
          {(club || highSchool) && !compact && (
            <p className="mt-2 text-sm text-white/60">
              {[club, highSchool].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {!photoUrl && (
          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            <span className="rounded-lg bg-black/40 px-4 py-2 text-center text-xs text-white/80">
              Add your photo
            </span>
          </div>
        )}
      </header>

      <div className="border-y border-white/10" style={{ backgroundColor: `${bg}ee` }}>
        <div
          className={`mx-auto grid grid-cols-4 divide-x divide-white/10 ${compact ? "max-w-full" : "max-w-lg"}`}
        >
          {[
            { label: "Goals", value: goalsScored != null ? goalsScored.toString() : "—" },
            { label: "Assists", value: assists != null ? assists.toString() : "—" },
            { label: "GPA", value: gpa != null ? gpa.toFixed(1) : "—" },
            { label: "Height", value: formatHeight(heightInches) },
          ].map((stat) => (
            <div key={stat.label} className={`text-center ${compact ? "px-1 py-3" : "px-2 py-4"}`}>
              <p
                className={`font-display ${compact ? "text-lg" : "text-2xl sm:text-3xl"}`}
                style={{ color: accent }}
              >
                {stat.value}
              </p>
              <p className={`stat-label mt-1 ${compact ? "text-[9px]" : ""}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className={`mx-auto space-y-6 px-4 py-8 ${compact ? "max-w-full" : "max-w-lg"}`}>
        <SocialConnect links={socialLinks} accent={accent} compact={compact} />

        {bio && (
          <section>
            <SectionTitle accent={accent}>About</SectionTitle>
            <p className="text-sm leading-relaxed text-muted">{bio}</p>
          </section>
        )}

        {highlights.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Highlights</SectionTitle>
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
            <SectionTitle accent={accent}>Schedule</SectionTitle>
            <ul className="space-y-3">
              {events.map((e) => (
                <li key={e.id} className="card-elevated text-sm">
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="text-muted">
                    {format(new Date(e.startsAt), "EEE, MMM d · h:mm a")}
                  </p>
                  {e.tournamentName && (
                    <p style={{ color: accent }}>{e.tournamentName}</p>
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
            <SectionTitle accent={accent}>College Goals</SectionTitle>
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
    </div>
    </div>
  );
}
