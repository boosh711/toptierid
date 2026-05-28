import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { LinkChildForm } from "./link-form";

export default async function ParentDashboardPage() {
  const session = await getSession();
  const links = await prisma.parentLink.findMany({
    where: { parentUserId: session!.id },
    include: {
      athleteProfile: {
        include: {
          user: true,
          profileViews: { orderBy: { createdAt: "desc" }, take: 3 },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-navy">Parent dashboard</h1>
        <p className="text-slate-600">Supervisory view of your athlete&apos;s recruiting activity</p>
      </div>

      <LinkChildForm />

      {links.map((link) => {
        const a = link.athleteProfile;
        return (
          <div key={link.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl text-brand">
                  {a.user.firstName} {a.user.lastName}
                </h2>
                <p className="text-sm text-slate-600">
                  {a.position} · Class of {a.gradYear} · {a.isPremium ? "Premium" : "Free tier"}
                </p>
              </div>
              <Link href={`/p/${a.slug}`} target="_blank" className="btn-secondary text-sm">
                View public profile ↗
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Recent coach views</p>
                <ul className="mt-2 text-sm text-slate-600">
                  {a.profileViews.length === 0 ? (
                    <li>No views yet</li>
                  ) : (
                    a.profileViews.map((v) => (
                      <li key={v.id}>
                        {a.isPremium ? "Coach viewed profile" : "Coach view (aggregate)"}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">Quick links</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href="/parent/inbox" className="text-sm text-brand hover:underline">
                    Inbox
                  </Link>
                  <Link href="/parent/profile" className="text-sm text-brand hover:underline">
                    Profile oversight
                  </Link>
                  <Link href="/parent/billing" className="text-sm text-brand hover:underline">
                    Billing
                  </Link>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Message approval (stub): {link.canApproveMessages ? "Enabled" : "Disabled"}
            </p>
          </div>
        );
      })}

      {links.length === 0 && (
        <p className="text-slate-500">Link an athlete using their profile slug as invite code (e.g. jordan-smith).</p>
      )}
    </div>
  );
}
