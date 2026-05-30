export type ProfileColors = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

export const ACCENT_PRESETS = [
  { id: "yellow", color: "#FACC15", label: "Yellow" },
  { id: "red", color: "#EF4444", label: "Red" },
  { id: "green", color: "#22C55E", label: "Green" },
  { id: "blue", color: "#1E6BD6", label: "Blue" },
  { id: "purple", color: "#A855F7", label: "Purple" },
  { id: "pink", color: "#EC4899", label: "Pink" },
  { id: "orange", color: "#F97316", label: "Orange" },
  { id: "cyan", color: "#06B6D4", label: "Cyan" },
  { id: "white", color: "#F8FAFC", label: "White" },
] as const;

export const BACKGROUND_PRESETS = [
  { id: "navy", color: "#0B1F3A", label: "Dark Blue" },
  { id: "crimson", color: "#2C0000", label: "Dark Red" },
  { id: "forest", color: "#0B2E13", label: "Dark Green" },
  { id: "purple", color: "#1E1035", label: "Deep Purple" },
  { id: "charcoal", color: "#12121A", label: "Dark Gray" },
  { id: "magenta", color: "#2A0A1F", label: "Dark Magenta" },
] as const;

/** Demo school palette lookup — matches partial names (e.g. "stanford") */
const SCHOOL_PALETTES: Record<string, ProfileColors & { displayName: string }> = {
  stanford: {
    displayName: "Stanford",
    accentColor: "#8C1515",
    primaryColor: "#8C1515",
    secondaryColor: "#2C0000",
  },
  duke: {
    displayName: "Duke",
    accentColor: "#003087",
    primaryColor: "#003087",
    secondaryColor: "#001A40",
  },
  texas: {
    displayName: "Texas",
    accentColor: "#BF5700",
    primaryColor: "#BF5700",
    secondaryColor: "#3D1500",
  },
  "north carolina": {
    displayName: "North Carolina",
    accentColor: "#7BAFD4",
    primaryColor: "#7BAFD4",
    secondaryColor: "#132C44",
  },
  unc: {
    displayName: "North Carolina",
    accentColor: "#7BAFD4",
    primaryColor: "#7BAFD4",
    secondaryColor: "#132C44",
  },
  ucla: {
    displayName: "UCLA",
    accentColor: "#2774AE",
    primaryColor: "#2774AE",
    secondaryColor: "#0B1F3A",
  },
  michigan: {
    displayName: "Michigan",
    accentColor: "#FFCB05",
    primaryColor: "#FFCB05",
    secondaryColor: "#001A4D",
  },
  notre: {
    displayName: "Notre Dame",
    accentColor: "#C99700",
    primaryColor: "#C99700",
    secondaryColor: "#0C2340",
  },
  "penn state": {
    displayName: "Penn State",
    accentColor: "#041E42",
    primaryColor: "#FFFFFF",
    secondaryColor: "#041E42",
  },
  florida: {
    displayName: "Florida",
    accentColor: "#FA4616",
    primaryColor: "#FA4616",
    secondaryColor: "#0021A5",
  },
  georgia: {
    displayName: "Georgia",
    accentColor: "#BA0C2F",
    primaryColor: "#BA0C2F",
    secondaryColor: "#000000",
  },
  clemson: {
    displayName: "Clemson",
    accentColor: "#F56600",
    primaryColor: "#F56600",
    secondaryColor: "#522D80",
  },
  usc: {
    displayName: "USC",
    accentColor: "#990000",
    primaryColor: "#990000",
    secondaryColor: "#FFC72C",
  },
  alabama: {
    displayName: "Alabama",
    accentColor: "#9E1B32",
    primaryColor: "#9E1B32",
    secondaryColor: "#1A0008",
  },
  virginia: {
    displayName: "Virginia",
    accentColor: "#232D4B",
    primaryColor: "#F84C1E",
    secondaryColor: "#232D4B",
  },
};

export function lookupSchoolColors(query: string): (ProfileColors & { displayName: string }) | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  if (SCHOOL_PALETTES[q]) return SCHOOL_PALETTES[q];

  for (const [key, palette] of Object.entries(SCHOOL_PALETTES)) {
    if (key.includes(q) || q.includes(key)) return palette;
  }

  return null;
}

export function defaultProfileColors(): ProfileColors {
  return {
    primaryColor: "#1E6BD6",
    secondaryColor: "#0B1F3A",
    accentColor: "#3D84E8",
  };
}
