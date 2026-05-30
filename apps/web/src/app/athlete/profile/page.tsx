import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { ProfileEditor } from "./editor";

export default async function AthleteProfilePage() {
  const session = await getSession();
  const profile = await prisma.athleteProfile.findUnique({
    where: { id: session!.athleteProfileId! },
    include: { collegeGoals: true },
  });

  return (
    <div>
      <h1 className="page-title">Edit profile</h1>
      <p className="text-muted">Customize your Digital ID — changes reflect on your public page</p>
      {profile && <ProfileEditor profile={profile} user={session!} />}
    </div>
  );
}
