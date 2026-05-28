import Link from "next/link";
import { Logo } from "./logo";
import { logoutAction } from "@/app/actions";

const tabs = [
  { href: "/coach", label: "Discover" },
  { href: "/coach/list", label: "My List" },
  { href: "/coach/staff", label: "Staff Board" },
  { href: "/coach/schedule", label: "Schedule" },
  { href: "/coach/inbox", label: "Inbox" },
];

export function CoachNav({ active }: { active?: string }) {
  return (
    <header className="border-b border-slate-200 bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Logo className="text-white [&_span]:text-white [&_.bg-brand]:bg-white [&_.bg-brand]:text-brand" />
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-slate-300 hover:text-white">
              Log out
            </button>
          </form>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 text-sm">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 min-h-[44px] flex items-center ${
                active === t.href || (active === "/coach" && t.href === "/coach")
                  ? "bg-brand text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
