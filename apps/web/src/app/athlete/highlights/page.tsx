import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { HighlightsManager } from "./manager";

export default async function HighlightsPage() {
  const session = await getSession();
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session!.athleteProfileId! },
    include: { highlights: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <h1 className="page-title">Highlights</h1>
      <p className="text-muted">
        {profile?.isPremium
          ? "Unlimited reels (Premium)"
          : "Free tier: 1 reel — upgrade for unlimited"}
      </p>
      {profile && (
        <HighlightsManager
          highlights={profile.highlights}
          isPremium={profile.isPremium}
        />
      )}
    </div>
  );
}
