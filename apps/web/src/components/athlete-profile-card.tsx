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
  return (
    <Link
      href={link}
      className="card block transition hover:border-accent/40 hover:bg-surface-elevated"
    >
      <div className="flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-elevated text-lg font-bold text-accent">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            `${firstName[0]}${lastName[0]}`
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm uppercase tracking-wide text-white">
            {firstName} {lastName}
          </h3>
          <p className="text-sm text-muted">
            {position} · Class of {gradYear}
            {gpa != null && ` · ${gpa.toFixed(1)} GPA`}
          </p>
          <p className="mt-1 truncate text-xs text-muted/80">
            {club}
            {state && ` · ${state}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
