"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  updateAthleteBasics,
  updateProfileStyle,
  updateCollegeGoals,
  updateSocialLinks,
  updatePhotoPosition,
} from "@/app/actions";
import { PhotoPositionEditor } from "@/components/photo-position-editor";
import { PublicProfileView } from "@/components/public-profile";
import { DivisionPills } from "@/components/color-swatch-picker";
import { ColorWheelPicker } from "@/components/color-wheel-picker";
import { ClubDropdown } from "@/components/club-dropdown";
import {
  ACCENT_PRESETS,
  BACKGROUND_PRESETS,
  lookupSchoolColors,
} from "@/lib/profile-colors";
import { getProfilePhotoUrl } from "@/lib/profile-photo";
import { prepareProfilePhoto, previewProfilePhoto } from "@/lib/prepare-profile-photo";
import { parsePhotoPosition, type PhotoPosition } from "@/lib/profile-hero";
import { SOCIAL_FIELDS, type SocialLinks } from "@/lib/social-links";
import { SOCCER_POSITIONS, GRAD_YEARS, DIVISIONS, US_REGIONS } from "@top-tier-id/types";

const LEAGUE_OPTIONS = [
  "ECNL",
  "ECRL",
  "GA (Girls Academy)",
  "GA Aspire",
  "DPL",
  "National 1 League (N1)",
] as const;

type Profile = {
  id: string;
  slug: string;
  position: string | null;
  gradYear: number | null;
  gpa: number | null;
  heightInches: number | null;
  goalsScored: number | null;
  assists: number | null;
  league: string | null;
  clubCrestUrl: string | null;
  club: string | null;
  highSchool: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  photoUrl: string | null;
  photoPositionX: number;
  photoPositionY: number;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  hudlUrl: string | null;
  xUrl: string | null;
  updatedAt: Date;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string | null;
  collegeGoals: {
    divisions: string[];
    regions: string[];
    targetSchools: string[];
  } | null;
};

const REGION_OPTIONS = ["Open to anywhere", ...US_REGIONS] as const;

export function ProfileEditor({
  profile,
  user,
}: {
  profile: Profile;
  user: { firstName: string; lastName: string };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    getProfilePhotoUrl(profile.id, profile.photoUrl, profile.updatedAt.getTime())
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [photoSaved, setPhotoSaved] = useState(false);
  const [photoPosition, setPhotoPosition] = useState<PhotoPosition>(() => ({
    ...parsePhotoPosition(profile.photoPositionX, profile.photoPositionY),
    scale: (profile as { photoScale?: number }).photoScale ?? 1.0,
  }));
  const [positionSaved, setPositionSaved] = useState(false);
  const [clubValue, setClubValue] = useState(profile.club ?? "");
  const [clubCrestUrl, setClubCrestUrl] = useState<string | null>(profile.clubCrestUrl ?? null);
  const [crestError, setCrestError] = useState("");
  const [crestSaved, setCrestSaved] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    instagramUrl: profile.instagramUrl,
    tiktokUrl: profile.tiktokUrl,
    youtubeUrl: profile.youtubeUrl,
    hudlUrl: profile.hudlUrl,
    xUrl: profile.xUrl,
  });
  const [colors, setColors] = useState({
    primaryColor: profile.primaryColor,
    secondaryColor: profile.secondaryColor,
    accentColor: profile.accentColor || profile.primaryColor,
  });

  useEffect(() => {
    setPhotoUrl(getProfilePhotoUrl(profile.id, profile.photoUrl, profile.updatedAt.getTime()));
  }, [profile.id, profile.photoUrl, profile.updatedAt]);

  useEffect(() => {
    setPhotoPosition(parsePhotoPosition(profile.photoPositionX, profile.photoPositionY));
  }, [profile.photoPositionX, profile.photoPositionY]);

  useEffect(() => {
    setSocialLinks({
      instagramUrl: profile.instagramUrl,
      tiktokUrl: profile.tiktokUrl,
      youtubeUrl: profile.youtubeUrl,
      hudlUrl: profile.hudlUrl,
      xUrl: profile.xUrl,
    });
  }, [
    profile.instagramUrl,
    profile.tiktokUrl,
    profile.youtubeUrl,
    profile.hudlUrl,
    profile.xUrl,
  ]);

  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolMatch, setSchoolMatch] = useState<string | null>(null);
  const [divisions, setDivisions] = useState<string[]>(
    profile.collegeGoals?.divisions ?? []
  );
  const [region, setRegion] = useState(
    profile.collegeGoals?.regions?.[0] ?? "Open to anywhere"
  );
  const [targetSchools, setTargetSchools] = useState<string[]>(
    profile.collegeGoals?.targetSchools ?? []
  );
  const [schoolInput, setSchoolInput] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const persistColors = (next: typeof colors) => {
    setColors(next);
    start(async () => {
      await updateProfileStyle({
        primaryColor: next.primaryColor,
        secondaryColor: next.secondaryColor,
        accentColor: next.accentColor,
      });
      setSavedMsg("Profile colors saved");
      setTimeout(() => setSavedMsg(""), 2000);
    });
  };

  const applySchoolColors = () => {
    const match = lookupSchoolColors(schoolQuery);
    if (!match) {
      setSchoolMatch(null);
      return;
    }
    const next = {
      primaryColor: match.primaryColor,
      secondaryColor: match.secondaryColor,
      accentColor: match.accentColor,
    };
    setSchoolMatch(match.displayName);
    persistColors(next);
  };

  const addTargetSchool = () => {
    const name = schoolInput.trim();
    if (!name || targetSchools.length >= 5 || targetSchools.includes(name)) return;
    setTargetSchools([...targetSchools, name]);
    setSchoolInput("");
  };

  const previewRegions =
    region === "Open to anywhere" ? [] : [region];

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-2">
      <div className="space-y-6">
        {/* Step 1 — Player info */}
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
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-light">
            ⚽ Player info
          </h2>
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
            <div>
              <label className="label">Goals (season)</label>
              <input name="goalsScored" type="number" min="0" defaultValue={profile.goalsScored ?? ""} className="input" placeholder="0" />
            </div>
            <div>
              <label className="label">Assists (season)</label>
              <input name="assists" type="number" min="0" defaultValue={profile.assists ?? ""} className="input" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="label">League / Level</label>
            <select name="league" defaultValue={profile.league ?? ""} className="input">
              <option value="">Select league…</option>
              {LEAGUE_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Club team</label>
            <input type="hidden" name="club" value={clubValue} readOnly />
            <ClubDropdown
              value={clubValue}
              onChange={(name) => setClubValue(name)}
            />
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
            setPhotoError("");
            const form = e.currentTarget;
            const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
            const file = fileInput?.files?.[0];
            if (!file) {
              setPhotoError("Choose a photo to upload.");
              return;
            }

            const currentPreview = photoPreview;
            start(async () => {
              try {
                const compressed = await prepareProfilePhoto(file);
                const fd = new FormData();
                fd.set("file", compressed);

                const response = await fetch("/api/athlete/profile-photo", {
                  method: "POST",
                  body: fd,
                });
                const res = await response.json();
                if (!response.ok || res.error) {
                  setPhotoError(res.error || "Upload failed. Try again.");
                  return;
                }
                if (res.url) {
                  if (currentPreview) URL.revokeObjectURL(currentPreview);
                  setPhotoPreview(null);
                  setPhotoUrl(res.url);
                  setPhotoPosition({ x: 50, y: 22 });
                }
                form.reset();
                setPhotoSaved(true);
                setTimeout(() => setPhotoSaved(false), 2000);
                router.refresh();
              } catch (error) {
                setPhotoError(
                  error instanceof Error ? error.message : "Upload failed. Try again."
                );
              }
            });
          }}
        >
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-light">
            📷 Photo
          </h2>
          <p className="text-xs text-muted">
            Shown on your public Digital ID. JPG, PNG, or iPhone HEIC, up to 4 MB.
          </p>
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand/40 bg-surface-elevated text-xl font-bold text-brand-light"
              style={
                photoPreview || photoUrl
                  ? undefined
                  : { background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})` }
              }
            >
              {photoPreview || photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview || photoUrl || ""}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user.firstName[0]}{user.lastName[0]}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <input
                name="file"
                type="file"
                accept="image/*,.heic,.heif"
                className="input"
                onChange={(e) => {
                  setPhotoError("");
                  const file = e.target.files?.[0];
                  if (!file) {
                    if (photoPreview) URL.revokeObjectURL(photoPreview);
                    setPhotoPreview(null);
                    return;
                  }
                  void previewProfilePhoto(file)
                    .then((url) => {
                      if (photoPreview) URL.revokeObjectURL(photoPreview);
                      setPhotoPreview(url);
                    })
                    .catch((error) => {
                      if (photoPreview) URL.revokeObjectURL(photoPreview);
                      setPhotoPreview(null);
                      setPhotoError(
                        error instanceof Error
                          ? error.message
                          : "Could not load that photo."
                      );
                    });
                }}
              />
            </div>
          </div>
          {photoError && <p className="text-xs text-red-400">{photoError}</p>}
          {photoSaved && <p className="text-xs text-success">Photo saved — your public profile is updated.</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Saving…" : "Save photo"}
          </button>

          {(photoPreview || photoUrl) && (
            <PhotoPositionEditor
              imageUrl={photoPreview || photoUrl || ""}
              position={photoPosition}
              onChange={setPhotoPosition}
              saving={pending}
              onSave={() =>
                start(async () => {
                  await updatePhotoPosition({
                    photoPositionX: photoPosition.x,
                    photoPositionY: photoPosition.y,
                    photoScale: photoPosition.scale ?? 1.0,
                  });
                  setPositionSaved(true);
                  setTimeout(() => setPositionSaved(false), 2000);
                  router.refresh();
                })
              }
            />
          )}
          {positionSaved && (
            <p className="text-xs text-success">Photo position saved.</p>
          )}
        </form>

        {/* Club crest upload */}
        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setCrestError("");
            const form = e.currentTarget;
            const fileInput = form.elements.namedItem("crest") as HTMLInputElement | null;
            const file = fileInput?.files?.[0];
            if (!file) {
              setCrestError("Choose an image to upload.");
              return;
            }
            start(async () => {
              try {
                const fd = new FormData();
                fd.set("file", file);
                const response = await fetch("/api/athlete/club-crest", {
                  method: "POST",
                  body: fd,
                });
                const res = await response.json();
                if (!response.ok || res.error) {
                  setCrestError(res.error || "Upload failed. Try again.");
                  return;
                }
                if (res.url) setClubCrestUrl(res.url);
                form.reset();
                setCrestSaved(true);
                setTimeout(() => setCrestSaved(false), 2000);
              } catch {
                setCrestError("Upload failed. Try again.");
              }
            });
          }}
        >
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-light">
            🛡️ Club crest
          </h2>
          <p className="text-xs text-muted">
            Upload your club&apos;s logo or crest. Use a PNG with a transparent background for best results. Shown as a badge on your profile.
          </p>
          <div className="flex items-center gap-4">
            {clubCrestUrl ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand/40 bg-surface-elevated p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={clubCrestUrl} alt="Club crest" className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border bg-surface-elevated text-2xl text-muted">
                🛡️
              </div>
            )}
            <div className="min-w-0 flex-1">
              <input
                name="crest"
                type="file"
                accept="image/*"
                className="input"
              />
            </div>
          </div>
          {crestError && <p className="text-xs text-red-400">{crestError}</p>}
          {crestSaved && <p className="text-xs text-success">Club crest saved.</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Saving…" : "Save crest"}
          </button>
        </form>

        {/* Connect — Social links */}
        <form
          className="card space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              await updateSocialLinks(socialLinks);
              setSavedMsg("Social links saved");
              setTimeout(() => setSavedMsg(""), 2000);
              router.refresh();
            });
          }}
        >
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-light">
            🔗 Connect
          </h2>
          <p className="text-xs text-muted">
            Add links to your social accounts. They appear as icons on your public Digital ID.
          </p>
          <div className="space-y-3">
            {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  type="text"
                  value={socialLinks[key] ?? ""}
                  onChange={(e) =>
                    setSocialLinks((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="input"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            Save social links
          </button>
        </form>

        {/* Step 3 — Colors (public profile only) */}
        <div className="card space-y-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-light">
            🎨 Step 3 · Pick your colors
          </h2>
          <p className="text-xs text-muted">
            These colors apply to your public Digital ID only — not the app dashboard.
          </p>

          <div>
            <label className="label">Match a school&apos;s colors</label>
            <div className="flex gap-2">
              <input
                value={schoolQuery}
                onChange={(e) => setSchoolQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applySchoolColors())}
                className="input flex-1"
                placeholder="Type a school… e.g. Stanford"
              />
              <button type="button" onClick={applySchoolColors} className="btn-secondary shrink-0">
                Apply
              </button>
            </div>
            {schoolMatch && (
              <p className="mt-2 text-xs text-success">Matched {schoolMatch} colors</p>
            )}
            {schoolQuery && !schoolMatch && lookupSchoolColors(schoolQuery) === null && schoolQuery.length > 2 && (
              <p className="mt-2 text-xs text-muted">Try Stanford, Duke, Texas, UCLA, Michigan…</p>
            )}
          </div>

          <ColorWheelPicker
            accentColor={colors.accentColor}
            backgroundColor={colors.secondaryColor}
            onAccentChange={(c) =>
              persistColors({ ...colors, accentColor: c, primaryColor: c })
            }
            onBackgroundChange={(c) =>
              persistColors({ ...colors, secondaryColor: c })
            }
            accentSwatches={ACCENT_PRESETS}
            backgroundSwatches={BACKGROUND_PRESETS}
          />

          {savedMsg && <p className="text-xs text-success">{savedMsg}</p>}
        </div>

        {/* Step 4 — College goals */}
        <div className="card space-y-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-brand-light">
            🎯 Step 4 · Your college goals
          </h2>
          <p className="text-sm text-muted">
            Tell coaches what kind of program you&apos;re looking for. This shows up on your profile so coaches know whether you&apos;re a fit.
          </p>

          <div>
            <label className="label">Divisions you&apos;re open to</label>
            <DivisionPills
              selected={divisions}
              onChange={setDivisions}
              options={DIVISIONS}
            />
            <p className="mt-2 text-xs text-muted">Tap to toggle. Pick all that apply.</p>
          </div>

          <div>
            <label className="label">Region preference</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input"
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Top schools you&apos;re interested in</label>
            <div className="flex gap-2">
              <input
                value={schoolInput}
                onChange={(e) => setSchoolInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTargetSchool())}
                className="input flex-1"
                placeholder="Type to add… e.g. Stanford"
                disabled={targetSchools.length >= 5}
              />
              <button
                type="button"
                onClick={addTargetSchool}
                disabled={targetSchools.length >= 5}
                className="btn-secondary shrink-0"
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Add up to 5 schools coaches should know you&apos;re interested in.
            </p>
            {targetSchools.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {targetSchools.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-sm text-brand-light"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setTargetSchools(targetSchools.filter((x) => x !== s))}
                      className="ml-1 text-muted hover:text-white"
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={pending}
            className="btn-primary w-full"
            onClick={() =>
              start(async () => {
                await updateCollegeGoals({
                  divisions,
                  regions: previewRegions,
                  targetSchools,
                });
                setSavedMsg("College goals saved");
                setTimeout(() => setSavedMsg(""), 2000);
              })
            }
          >
            Save college goals
          </button>
        </div>
      </div>

      <div className="xl:sticky xl:top-8 xl:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
          Live preview · public profile
        </p>
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
            goalsScored={profile.goalsScored}
            assists={profile.assists}
            clubCrestUrl={clubCrestUrl}
            club={profile.club}
            highSchool={profile.highSchool}
            city={profile.city}
            state={profile.state}
            bio={profile.bio}
            photoUrl={photoPreview || photoUrl}
            photoPositionX={photoPosition.x}
            photoPositionY={photoPosition.y}
            photoScale={photoPosition.scale ?? 1}
            primaryColor={colors.primaryColor}
            secondaryColor={colors.secondaryColor}
            accentColor={colors.accentColor}
            highlights={[]}
            events={[]}
            divisions={divisions}
            regions={previewRegions}
            targetSchools={targetSchools}
            socialLinks={socialLinks}
          />
        </div>
      </div>
    </div>
  );
}
