import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { AthleteNav } from "@/components/nav-athlete";

export default async function AthleteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ATHLETE") redirect("/auth/login");

  const profile = session.athleteProfileId
    ? await prisma.athleteProfile.findUnique({ where: { id: session.athleteProfileId } })
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <AthleteNav slug={profile?.slug} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
