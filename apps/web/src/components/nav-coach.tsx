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
    <header className="border-b border-border bg-navy-deep">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Logo />
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-muted hover:text-white">
              Log out
            </button>
          </form>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 text-sm">
          {tabs.map((t) => {
            const isActive = active === t.href || (active === "/coach" && t.href === "/coach");
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-4 py-2.5 ${
                  isActive
                    ? "bg-accent font-semibold text-black"
                    : "text-muted hover:bg-surface-elevated hover:text-white"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
