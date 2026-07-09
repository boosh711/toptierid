import { getSession } from "@/lib/auth";
import { prisma } from "@top-tier-id/database";
import { ProfileEditor } from "./editor";
import { toggleProfileVisibility } from "@/app/actions";

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

      {profile && (
        <div className="card mb-6 flex items-center justify-between gap-4 p-4">
          <div>
            {profile.isVisible ? (
              <span className="font-medium text-brand">👁 Visible to coaches</span>
            ) : (
              <span className="font-medium text-muted">🔒 Hidden from coaches</span>
            )}
            <p className="text-muted text-sm mt-0.5">
              {profile.isVisible
                ? "Your profile appears in coach search results."
                : "Your profile is hidden from coach search results."}
            </p>
          </div>
          <form action={async () => { "use server"; await toggleProfileVisibility(); }}>
            <button type="submit" className="btn btn-secondary text-sm">
              {profile.isVisible ? "Hide Profile" : "Make Visible"}
            </button>
          </form>
        </div>
      )}

      {profile && <ProfileEditor profile={profile} user={session!} />}
    </div>
  );
}
