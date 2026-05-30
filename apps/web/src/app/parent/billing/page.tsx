import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { PRICING } from "@top-tier-id/types";

export default async function ParentBillingPage() {
  const session = await getSession();
  const links = await prisma.parentLink.findMany({
    where: { parentUserId: session!.id },
    include: { athleteProfile: { include: { user: true } } },
  });

  return (
    <div>
      <h1 className="page-title">Billing</h1>
      <p className="text-muted">Subscription management (Stripe stub)</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card border-accent">
          <h2 className="font-semibold">{PRICING.athletePremium.name}</h2>
          <p className="mt-2 font-display text-2xl text-accent">
            {PRICING.athletePremium.price}
            <span className="text-sm font-sans">{PRICING.athletePremium.period}</span>
          </p>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            <li>✓ Unlimited highlight reels</li>
            <li>✓ See which coaches viewed profile</li>
            <li>✓ Priority search placement</li>
            <li>✓ Custom toptierid.com URL</li>
          </ul>
          <button type="button" disabled className="btn-primary mt-6 opacity-50">
            Upgrade (coming soon)
          </button>
        </div>

        {links.map((l) => (
          <div key={l.id} className="card">
            <p className="font-medium">
              {l.athleteProfile.user.firstName} {l.athleteProfile.user.lastName}
            </p>
            <p className="mt-2 text-sm">
              Current plan:{" "}
              <span className="font-semibold text-accent">
                {l.athleteProfile.isPremium ? "Premium" : "Free"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
