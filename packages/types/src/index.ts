export const UserRole = {
  ATHLETE: "ATHLETE",
  PARENT: "PARENT",
  COACH: "COACH",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const NoteVisibility = {
  PRIVATE: "PRIVATE",
  PROGRAM: "PROGRAM",
} as const;

export type NoteVisibility = (typeof NoteVisibility)[keyof typeof NoteVisibility];

export const BRAND = {
  primary: "#1E6BD6",
  tagline: "Direct Connection. No Middlemen.",
} as const;

export const PRICING = {
  athleteFree: { name: "Athlete — Free", price: "$0", period: "forever" },
  athletePremium: { name: "Athlete — Premium", price: "$14.99", period: "/mo or $99/yr" },
  coach: { name: "Individual Coach", price: "FREE", period: "forever" },
  program: { name: "College Program", price: "$299", period: "/mo or $2,990/yr" },
} as const;

export const SOCCER_POSITIONS = [
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LW",
  "RW",
  "ST",
] as const;

export const GRAD_YEARS = [2025, 2026, 2027, 2028, 2029, 2030] as const;

export const DIVISIONS = ["D1", "D2", "D3", "NAIA", "JUCO"] as const;

export const US_REGIONS = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "West",
] as const;
