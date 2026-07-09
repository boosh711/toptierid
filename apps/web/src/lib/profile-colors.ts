export type ProfileColors = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

export const ACCENT_PRESETS = [
  // Blues
  { id: "brand-blue", color: "#1E6BD6", label: "Brand Blue" },
  { id: "cobalt", color: "#0047AB", label: "Cobalt" },
  { id: "royal-blue", color: "#4169E1", label: "Royal Blue" },
  { id: "sky-blue", color: "#87CEEB", label: "Sky Blue" },
  { id: "navy", color: "#001F5B", label: "Navy" },
  { id: "cyan", color: "#06B6D4", label: "Cyan" },
  { id: "teal", color: "#008080", label: "Teal" },
  // Greens
  { id: "emerald", color: "#10B981", label: "Emerald" },
  { id: "green", color: "#22C55E", label: "Green" },
  { id: "lime", color: "#84CC16", label: "Lime" },
  { id: "mint", color: "#98FF98", label: "Mint" },
  { id: "sage", color: "#8FBC8F", label: "Sage" },
  { id: "olive", color: "#808000", label: "Olive" },
  // Reds & Pinks
  { id: "scarlet", color: "#DC143C", label: "Scarlet" },
  { id: "red", color: "#EF4444", label: "Red" },
  { id: "crimson", color: "#8B0000", label: "Crimson" },
  { id: "maroon", color: "#800000", label: "Maroon" },
  { id: "rose", color: "#FF007F", label: "Rose" },
  { id: "hot-pink", color: "#FF69B4", label: "Hot Pink" },
  { id: "pink", color: "#EC4899", label: "Pink" },
  { id: "coral", color: "#FF6B6B", label: "Coral" },
  { id: "magenta", color: "#FF00FF", label: "Magenta" },
  // Oranges & Yellows
  { id: "orange", color: "#F97316", label: "Orange" },
  { id: "burnt-orange", color: "#CC5500", label: "Burnt Orange" },
  { id: "peach", color: "#FFAD8A", label: "Peach" },
  { id: "gold", color: "#FFD700", label: "Gold" },
  { id: "amber", color: "#F59E0B", label: "Amber" },
  { id: "yellow", color: "#FACC15", label: "Yellow" },
  // Purples
  { id: "purple", color: "#A855F7", label: "Purple" },
  { id: "violet", color: "#8B00FF", label: "Violet" },
  { id: "indigo", color: "#4B0082", label: "Indigo" },
  // Neutrals
  { id: "white", color: "#F8FAFC", label: "White" },
  { id: "silver", color: "#C0C0C0", label: "Silver" },
  { id: "platinum", color: "#E5E4E2", label: "Platinum" },
  { id: "cream", color: "#FFFDD0", label: "Cream" },
  // Earth tones
  { id: "bronze", color: "#CD7F32", label: "Bronze" },
  { id: "brown", color: "#8B4513", label: "Brown" },
  { id: "chocolate", color: "#7B3F00", label: "Chocolate" },
] as const;

export const BACKGROUND_PRESETS = [
  { id: "navy", color: "#0B1F3A", label: "Dark Blue" },
  { id: "midnight", color: "#0A0A0F", label: "Midnight" },
  { id: "jet-black", color: "#0D0D0D", label: "Jet Black" },
  { id: "charcoal", color: "#12121A", label: "Dark Gray" },
  { id: "space-gray", color: "#1C1C2E", label: "Space Gray" },
  { id: "slate", color: "#1A1A2E", label: "Slate" },
  { id: "deep-navy", color: "#050A1A", label: "Deep Navy" },
  { id: "dark-indigo", color: "#0A0A2E", label: "Dark Indigo" },
  { id: "crimson", color: "#2C0000", label: "Dark Red" },
  { id: "dark-maroon", color: "#1A0005", label: "Dark Maroon" },
  { id: "forest", color: "#0B2E13", label: "Dark Green" },
  { id: "dark-teal", color: "#0A1F1F", label: "Dark Teal" },
  { id: "dark-olive", color: "#0F1A0A", label: "Dark Olive" },
  { id: "purple", color: "#1E1035", label: "Deep Purple" },
  { id: "magenta", color: "#2A0A1F", label: "Dark Magenta" },
  { id: "dark-brown", color: "#1A0D00", label: "Dark Brown" },
  { id: "gunmetal", color: "#1B1F23", label: "Gunmetal" },
  { id: "dark-navy-2", color: "#0C1220", label: "Ink Navy" },
  { id: "dark-forest-2", color: "#061209", label: "Deep Forest" },
  { id: "obsidian", color: "#0B0A10", label: "Obsidian" },
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
    accentColor: "#FFFFFF",
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
    accentColor: "#F84C1E",
    primaryColor: "#F84C1E",
    secondaryColor: "#232D4B",
  },
  "ohio state": {
    displayName: "Ohio State",
    accentColor: "#BB0000",
    primaryColor: "#BB0000",
    secondaryColor: "#1A0000",
  },
  auburn: {
    displayName: "Auburn",
    accentColor: "#E87722",
    primaryColor: "#E87722",
    secondaryColor: "#0C2340",
  },
  lsu: {
    displayName: "LSU",
    accentColor: "#FDD023",
    primaryColor: "#FDD023",
    secondaryColor: "#461D7C",
  },
  "florida state": {
    displayName: "Florida State",
    accentColor: "#CEB888",
    primaryColor: "#CEB888",
    secondaryColor: "#782F40",
  },
  tennessee: {
    displayName: "Tennessee",
    accentColor: "#FF8200",
    primaryColor: "#FF8200",
    secondaryColor: "#1A0800",
  },
  arkansas: {
    displayName: "Arkansas",
    accentColor: "#9D2235",
    primaryColor: "#9D2235",
    secondaryColor: "#1A0008",
  },
  baylor: {
    displayName: "Baylor",
    accentColor: "#003015",
    primaryColor: "#FBBE17",
    secondaryColor: "#003015",
  },
  "texas a&m": {
    displayName: "Texas A&M",
    accentColor: "#500000",
    primaryColor: "#500000",
    secondaryColor: "#0A0000",
  },
  kentucky: {
    displayName: "Kentucky",
    accentColor: "#0033A0",
    primaryColor: "#0033A0",
    secondaryColor: "#00000A",
  },
  washington: {
    displayName: "Washington",
    accentColor: "#4B2E83",
    primaryColor: "#4B2E83",
    secondaryColor: "#1A0D2E",
  },
  oregon: {
    displayName: "Oregon",
    accentColor: "#154733",
    primaryColor: "#FEE123",
    secondaryColor: "#154733",
  },
  nebraska: {
    displayName: "Nebraska",
    accentColor: "#E41C38",
    primaryColor: "#E41C38",
    secondaryColor: "#1A0000",
  },
  "iowa": {
    displayName: "Iowa",
    accentColor: "#FFCD00",
    primaryColor: "#FFCD00",
    secondaryColor: "#000000",
  },
  "mississippi": {
    displayName: "Ole Miss",
    accentColor: "#CE1126",
    primaryColor: "#CE1126",
    secondaryColor: "#14213D",
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

export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
