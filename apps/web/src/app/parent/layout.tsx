import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ParentNav } from "@/components/nav-parent";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "PARENT") redirect("/auth/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <ParentNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
