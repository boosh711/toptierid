import Link from "next/link";
import { Logo } from "./logo";
import { logoutAction } from "@/app/actions";

const links = [
  { href: "/parent", label: "Dashboard" },
  { href: "/parent/profile", label: "Athlete profile" },
  { href: "/parent/inbox", label: "Inbox" },
  { href: "/parent/billing", label: "Billing" },
];

export function ParentNav() {
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
          <form action={logoutAction}>
            <button type="submit" className="nav-link">Log out</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
