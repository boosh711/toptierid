"use client";

import { useTransition } from "react";
import {
  updateAthleteBasics,
  updateProfileStyle,
  updateCollegeGoals,
  uploadPhoto,
} from "@/app/actions";
import { PublicProfileView } from "@/components/public-profile";
import { SOCCER_POSITIONS, GRAD_YEARS, DIVISIONS, US_REGIONS } from "@top-tier-id/types";

type Profile = {
  slug: string;
  position: string | null;
  gradYear: number | null;
  gpa: number | null;
  club: string | null;
  highSchool: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  photoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  collegeGoals: {
    divisions: string[];
    regions: string[];
    targetSchools: string[];
  } | null;
};

export function ProfileEditor({
  profile,
  user,
}: {
  profile: Profile;
  user: { firstName: string; lastName: string };
}) {
  const [pending, start] = useTransition();

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-2">
      <div className="space-y-6">
        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await updateAthleteBasics({
                firstName: user.firstName,
                lastName: user.lastName,
                position: fd.get("position"),
                gradYear: fd.get("gradYear"),
                gpa: fd.get("gpa") || undefined,
                club: fd.get("club"),
                highSchool: fd.get("highSchool"),
                state: fd.get("state"),
                bio: fd.get("bio"),
              });
            });
          }}
        >
          <h2 className="font-semibold">Stats & bio</h2>
          <select name="position" defaultValue={profile.position ?? ""} className="input">
            {SOCCER_POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select name="gradYear" defaultValue={profile.gradYear ?? ""} className="input">
            {GRAD_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <input name="gpa" type="number" step="0.01" defaultValue={profile.gpa ?? ""} className="input" placeholder="GPA" />
          <input name="club" defaultValue={profile.club ?? ""} className="input" placeholder="Club" />
          <input name="highSchool" defaultValue={profile.highSchool ?? ""} className="input" />
          <input name="state" defaultValue={profile.state ?? ""} className="input" maxLength={2} />
          <textarea name="bio" defaultValue={profile.bio ?? ""} className="input" rows={4} />
          <button type="submit" disabled={pending} className="btn-primary">Save</button>
        </form>

        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => { await uploadPhoto(fd); });
          }}
        >
          <h2 className="font-semibold">Photo</h2>
          <input name="file" type="file" accept="image/*" className="input" />
          <button type="submit" className="btn-secondary">Upload photo</button>
        </form>

        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => {
              await updateProfileStyle({
                primaryColor: String(fd.get("primaryColor")),
                secondaryColor: String(fd.get("secondaryColor")),
              });
            });
          }}
        >
          <h2 className="font-semibold">Colors</h2>
          <input name="primaryColor" type="color" defaultValue={profile.primaryColor} className="h-10 w-full" />
          <input name="secondaryColor" type="color" defaultValue={profile.secondaryColor} className="h-10 w-full" />
          <button type="submit" className="btn-secondary">Save colors</button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <PublicProfileView
          firstName={user.firstName}
          lastName={user.lastName}
          slug={profile.slug}
          position={profile.position}
          gradYear={profile.gradYear}
          gpa={profile.gpa}
          club={profile.club}
          highSchool={profile.highSchool}
          city={profile.city}
          state={profile.state}
          bio={profile.bio}
          photoUrl={profile.photoUrl}
          primaryColor={profile.primaryColor}
          secondaryColor={profile.secondaryColor}
          highlights={[]}
          events={[]}
          divisions={profile.collegeGoals?.divisions ?? []}
          regions={profile.collegeGoals?.regions ?? []}
          targetSchools={profile.collegeGoals?.targetSchools ?? []}
        />
      </div>
    </div>
  );
}
