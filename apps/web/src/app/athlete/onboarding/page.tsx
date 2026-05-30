import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { OnboardingWizard } from "./wizard";

export default async function OnboardingPage() {
  const session = await getSession();
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session!.athleteProfileId! },
    include: { collegeGoals: true },
  });
  if (!profile) redirect("/athlete");
  if (profile.onboardingStep >= 6 && profile.isPublished) redirect("/athlete");

  return (
    <div>
      <h1 className="page-title">Build your Digital ID</h1>
      <p className="text-muted">Step {profile.onboardingStep} of 5</p>
      <OnboardingWizard profile={profile} user={session!} />
    </div>
  );
}
