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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Logo />
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
              {l.label}
            </Link>
          ))}
          <form action={logoutAction}>
            <button type="submit" className="rounded-lg px-3 py-2 text-slate-500">Log out</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
