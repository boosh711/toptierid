import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ATHLETE", "PARENT", "COACH"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const athleteBasicsSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.string().min(1),
  gradYear: z.coerce.number().int().min(2024).max(2032),
  gpa: z.coerce.number().min(0).max(4).optional(),
  heightInches: z.coerce.number().int().min(48).max(84).optional(),
  goalsScored: z.coerce.number().int().min(0).max(999).optional(),
  assists: z.coerce.number().int().min(0).max(999).optional(),
  league: z.string().optional(),
  club: z.string().optional(),
  highSchool: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  bio: z.string().max(2000).optional(),
});

export const profileStyleSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const slugSchema = z
  .string()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only");

const optionalSocialField = z
  .string()
  .optional()
  .transform((v) => {
    const trimmed = v?.trim();
    return trimmed ? trimmed : undefined;
  });

export const photoPositionSchema = z.object({
  photoPositionX: z.coerce.number().min(0).max(100),
  photoPositionY: z.coerce.number().min(0).max(100),
  photoScale: z.coerce.number().min(1).max(3).optional().default(1.0),
});

export const socialLinksSchema = z.object({
  instagramUrl: optionalSocialField,
  tiktokUrl: optionalSocialField,
  youtubeUrl: optionalSocialField,
  hudlUrl: optionalSocialField,
  xUrl: optionalSocialField,
});

export const collegeGoalsSchema = z.object({
  divisions: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  targetSchools: z.array(z.string()).default([]),
});

export const scheduleEventSchema = z.object({
  title: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  opponent: z.string().optional(),
  venue: z.string().optional(),
  field: z.string().optional(),
  fieldNumber: z.string().optional(),
  jerseyColor: z.string().optional(),
  tournamentName: z.string().optional(),
});

export const highlightSchema = z.object({
  title: z.string().min(1).max(120),
});

export const coachSearchSchema = z.object({
  q: z.string().optional(),
  position: z.string().optional(),
  gradYear: z.coerce.number().optional(),
  gpaMin: z.coerce.number().optional(),
  gpaMax: z.coerce.number().optional(),
  state: z.string().optional(),
  club: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const coachNoteSchema = z.object({
  body: z.string().min(1).max(10000),
  visibility: z.enum(["PRIVATE", "PROGRAM"]).default("PRIVATE"),
  athleteProfileId: z.string(),
});

export const messageSchema = z.object({
  body: z.string().min(1).max(5000),
  threadId: z.string(),
});
