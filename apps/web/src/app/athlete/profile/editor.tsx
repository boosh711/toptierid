"use client";

import { useTransition } from "react";
import {
  updateAthleteBasics,
  updateProfileStyle,
  uploadPhoto,
} from "@/app/actions";
import { PublicProfileView } from "@/components/public-profile";
import { SOCCER_POSITIONS, GRAD_YEARS } from "@top-tier-id/types";

type Profile = {
  slug: string;
  position: string | null;
  gradYear: number | null;
  gpa: number | null;
  heightInches: number | null;
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
                heightInches: fd.get("heightInches") || undefined,
                club: fd.get("club"),
                highSchool: fd.get("highSchool"),
                state: fd.get("state"),
                bio: fd.get("bio"),
              });
            });
          }}
        >
          <h2 className="section-heading">Player info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Position</label>
              <select name="position" defaultValue={profile.position ?? ""} className="input">
                {SOCCER_POSITIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Grad year</label>
              <select name="gradYear" defaultValue={profile.gradYear ?? ""} className="input">
                {GRAD_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">GPA</label>
              <input name="gpa" type="number" step="0.01" defaultValue={profile.gpa ?? ""} className="input" />
            </div>
            <div>
              <label className="label">Height (inches)</label>
              <input name="heightInches" type="number" defaultValue={profile.heightInches ?? ""} className="input" placeholder="68" />
            </div>
          </div>
          <div>
            <label className="label">Club team</label>
            <input name="club" defaultValue={profile.club ?? ""} className="input" />
          </div>
          <div>
            <label className="label">High school</label>
            <input name="highSchool" defaultValue={profile.highSchool ?? ""} className="input" />
          </div>
          <div>
            <label className="label">State</label>
            <input name="state" defaultValue={profile.state ?? ""} className="input" maxLength={2} />
          </div>
          <div>
            <label className="label">About</label>
            <textarea name="bio" defaultValue={profile.bio ?? ""} className="input" rows={4} placeholder="Tell coaches about your game..." />
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            Save profile
          </button>
        </form>

        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            start(async () => { await uploadPhoto(fd); });
          }}
        >
          <h2 className="section-heading">Photo</h2>
          <input name="file" type="file" accept="image/*" className="input" />
          <button type="submit" className="btn-secondary w-full">Upload photo</button>
        </form>
      </div>

      <div className="xl:sticky xl:top-8 xl:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Live preview</p>
        <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/50">
          <PublicProfileView
            compact
            firstName={user.firstName}
            lastName={user.lastName}
            slug={profile.slug}
            position={profile.position}
            gradYear={profile.gradYear}
            gpa={profile.gpa}
            heightInches={profile.heightInches}
            club={profile.club}
            highSchool={profile.highSchool}
            city={profile.city}
            state={profile.state}
            bio={profile.bio}
            photoUrl={profile.photoUrl}
            highlights={[]}
            events={[]}
            divisions={profile.collegeGoals?.divisions ?? []}
            regions={profile.collegeGoals?.regions ?? []}
            targetSchools={profile.collegeGoals?.targetSchools ?? []}
          />
        </div>
      </div>
    </div>
  );
}
