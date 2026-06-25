import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-base">
      <nav className="border-b border-border bg-surface px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-6">
          <span className="font-bold text-brand">Admin</span>
          <Link href="/admin" className="text-sm text-muted hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/admin/users" className="text-sm text-muted hover:text-foreground">
            Users
          </Link>
          <Link href="/admin/athletes" className="text-sm text-muted hover:text-foreground">
            Athletes
          </Link>
          <Link href="/admin/coaches" className="text-sm text-muted hover:text-foreground">
            Coaches
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
