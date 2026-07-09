import Link from "next/link";

type Props = {
  slug: string;
  firstName: string;
  lastName: string;
  position?: string | null;
  gradYear?: number | null;
  club?: string | null;
  state?: string | null;
  gpa?: number | null;
  photoUrl?: string | null;
  href?: string;
};

export function AthleteProfileCard({
  slug,
  firstName,
  lastName,
  position,
  gradYear,
  club,
  state,
  gpa,
  photoUrl,
  href,
}: Props) {
  const link = href ?? `/coach/athlete/${slug}`;
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <Link
      href={link}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-brand"
    >
      {/* Photo hero — top 60% of card */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-elevated">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand/30 to-navy-deep">
            <span className="font-display text-5xl font-bold text-brand-light/60">
              {initials}
            </span>
          </div>
        )}

        {/* Gradient overlay — smooth fade to card bg */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Position badge — top right */}
        {position && (
          <span className="absolute right-3 top-3 rounded-md bg-brand px-2.5 py-1 font-display text-xs font-bold uppercase tracking-wider text-white shadow-brand">
            {position}
          </span>
        )}

        {/* Name overlay — bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-white drop-shadow-lg">
            {firstName}
            <br />
            <span className="text-brand-light">{lastName.toUpperCase()}</span>
          </h3>
        </div>
      </div>

      {/* Stats row */}
      <div className="border-t border-border bg-surface p-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {gradYear && (
            <span>
              <span className="font-semibold text-white">Class of {gradYear}</span>
            </span>
          )}
          {gpa != null && (
            <span className="text-brand-light font-semibold">{gpa.toFixed(1)} GPA</span>
          )}
          {state && <span>{state}</span>}
        </div>
        {club && (
          <p className="mt-1 truncate text-xs text-muted/70">{club}</p>
        )}
      </div>
    </Link>
  );
}
