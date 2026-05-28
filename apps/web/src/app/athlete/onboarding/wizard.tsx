"use client";

import { useState, useTransition } from "react";
import {
  updateAthleteBasics,
  updateProfileStyle,
  updateCollegeGoals,
  updateSlug,
  uploadPhoto,
} from "@/app/actions";
import { SOCCER_POSITIONS, GRAD_YEARS, DIVISIONS, US_REGIONS } from "@top-tier-id/types";

type Profile = {
  id: string;
  slug: string;
  position: string | null;
  gradYear: number | null;
  gpa: number | null;
  club: string | null;
  highSchool: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  primaryColor: string;
  secondaryColor: string;
  photoUrl: string | null;
  onboardingStep: number;
  collegeGoals: {
    divisions: string[];
    regions: string[];
    targetSchools: string[];
  } | null;
};

export function OnboardingWizard({
  profile,
  user,
}: {
  profile: Profile;
  user: { firstName: string; lastName: string };
}) {
  const [step, setStep] = useState(Math.max(1, profile.onboardingStep));
  const [pending, start] = useTransition();
  const [slug, setSlug] = useState(profile.slug);
  const [error, setError] = useState("");

  const next = () => setStep((s) => s + 1);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div className="card">
        {step === 1 && (
          <form
            className="space-y-4"
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
                  club: fd.get("club") || undefined,
                  highSchool: fd.get("highSchool") || undefined,
                  state: fd.get("state") || undefined,
                  bio: fd.get("bio") || undefined,
                });
                next();
              });
            }}
          >
            <h2 className="font-semibold">Basics</h2>
            <div>
              <label className="label">Position</label>
              <select name="position" defaultValue={profile.position ?? ""} className="input" required>
                <option value="">Select</option>
                {SOCCER_POSITIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Grad year</label>
              <select name="gradYear" defaultValue={profile.gradYear ?? ""} className="input" required>
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
              <label className="label">Club</label>
              <input name="club" defaultValue={profile.club ?? ""} className="input" />
            </div>
            <div>
              <label className="label">High school</label>
              <input name="highSchool" defaultValue={profile.highSchool ?? ""} className="input" />
            </div>
            <div>
              <label className="label">State</label>
              <input name="state" maxLength={2} defaultValue={profile.state ?? ""} className="input" />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea name="bio" defaultValue={profile.bio ?? ""} className="input" rows={3} />
            </div>
            <button type="submit" disabled={pending} className="btn-primary">Continue</button>
          </form>
        )}

        {step === 2 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              start(async () => {
                await uploadPhoto(fd);
                next();
              });
            }}
          >
            <h2 className="font-semibold">Profile photo</h2>
            <input name="file" type="file" accept="image/*" className="input" />
            <button type="submit" disabled={pending} className="btn-primary">Upload & continue</button>
            <button type="button" onClick={next} className="btn-secondary ml-2">Skip</button>
          </form>
        )}

        {step === 3 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              start(async () => {
                await updateProfileStyle({
                  primaryColor: fd.get("primaryColor"),
                  secondaryColor: fd.get("secondaryColor"),
                });
                next();
              });
            }}
          >
            <h2 className="font-semibold">School colors</h2>
            <div>
              <label className="label">Primary</label>
              <input name="primaryColor" type="color" defaultValue={profile.primaryColor} className="h-10 w-full" />
            </div>
            <div>
              <label className="label">Secondary</label>
              <input name="secondaryColor" type="color" defaultValue={profile.secondaryColor} className="h-10 w-full" />
            </div>
            <button type="submit" disabled={pending} className="btn-primary">Continue</button>
          </form>
        )}

        {step === 4 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const divisions = fd.getAll("divisions") as string[];
              const regions = fd.getAll("regions") as string[];
              const schools = String(fd.get("targetSchools") || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              start(async () => {
                await updateCollegeGoals({ divisions, regions, targetSchools: schools });
                next();
              });
            }}
          >
            <h2 className="font-semibold">College goals</h2>
            <div>
              <label className="label">Divisions</label>
              <div className="flex flex-wrap gap-2">
                {DIVISIONS.map((d) => (
                  <label key={d} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      name="divisions"
                      value={d}
                      defaultChecked={profile.collegeGoals?.divisions.includes(d)}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Regions</label>
              <div className="flex flex-wrap gap-2">
                {US_REGIONS.map((r) => (
                  <label key={r} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      name="regions"
                      value={r}
                      defaultChecked={profile.collegeGoals?.regions.includes(r)}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Target schools (comma-separated)</label>
              <input
                name="targetSchools"
                className="input"
                defaultValue={profile.collegeGoals?.targetSchools.join(", ")}
              />
            </div>
            <button type="submit" disabled={pending} className="btn-primary">Continue</button>
          </form>
        )}

        {step === 5 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              start(async () => {
                const res = await updateSlug(slug);
                if (res?.error) {
                  setError(res.error);
                  return;
                }
                window.location.href = "/athlete";
              });
            }}
          >
            <h2 className="font-semibold">Choose your URL</h2>
            <p className="text-sm text-slate-600">toptierid.com/p/</p>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="input"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={pending} className="btn-primary">
              Publish profile
            </button>
          </form>
        )}
      </div>

      <div
        className="rounded-xl p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${profile.primaryColor} 0%, ${profile.secondaryColor} 100%)`,
        }}
      >
        <p className="text-sm opacity-80">Preview</p>
        <h3 className="font-display text-2xl">
          {user.firstName} {user.lastName}
        </h3>
        <p className="opacity-90">{profile.position} · {profile.gradYear}</p>
      </div>
    </div>
  );
}
