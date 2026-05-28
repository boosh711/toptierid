import Link from "next/link";
import { formatName } from "@/lib/utils";

type Props = {
  slug: string;
  firstName: string;
  lastName: string;
  position?: string | null;
  gradYear?: number | null;
  club?: string | null;
  state?: string | null;
  gpa?: number | null;
  primaryColor?: string;
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
  primaryColor = "#1E6BD6",
  photoUrl,
  href,
}: Props) {
  const link = href ?? `/coach/athlete/${slug}`;
  return (
    <Link
      href={link}
      className="card block transition hover:border-brand hover:shadow-md"
    >
      <div className="flex gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-full w-full rounded-xl object-cover" />
          ) : (
            `${firstName[0]}${lastName[0]}`
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-navy">{formatName(firstName, lastName)}</h3>
          <p className="text-sm text-slate-600">
            {position} · Class of {gradYear}
            {gpa != null && ` · ${gpa.toFixed(1)} GPA`}
          </p>
          <p className="mt-1 truncate text-sm text-slate-500">
            {club}
            {state && ` · ${state}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
