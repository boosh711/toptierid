import Link from "next/link";
import { Logo } from "./logo";
import { logoutAction } from "@/app/actions";

const links = [
  { href: "/athlete", label: "Home" },
  { href: "/athlete/profile", label: "Profile" },
  { href: "/athlete/highlights", label: "Highlights" },
  { href: "/athlete/schedule", label: "Schedule" },
  { href: "/athlete/inbox", label: "Inbox" },
  { href: "/athlete/analytics", label: "Analytics" },
];

export function AthleteNav({ slug }: { slug?: string }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Logo />
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          {slug && (
            <Link
              href={`/p/${slug}`}
              target="_blank"
              className="nav-link-active"
            >
              View public page ↗
            </Link>
          )}
          <form action={logoutAction}>
            <button type="submit" className="nav-link text-muted hover:text-white">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
