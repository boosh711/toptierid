export type SocialPlatform = "instagram" | "tiktok" | "youtube" | "hudl" | "x";

export type SocialLinks = {
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  hudlUrl?: string | null;
  xUrl?: string | null;
};

const PLATFORM_PREFIX: Record<SocialPlatform, string> = {
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
  hudl: "https://hudl.com/profile/",
  x: "https://x.com/",
};

export function normalizeSocialUrl(
  value: string | undefined | null,
  platform: SocialPlatform
): string | null {
  if (!value?.trim()) return null;
  let url = value.trim();

  if (!/^https?:\/\//i.test(url)) {
    const handle = url.replace(/^@/, "").replace(/^\//, "");
    url = `${PLATFORM_PREFIX[platform]}${handle}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(".")) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export function normalizeSocialLinks(links: SocialLinks): SocialLinks {
  return {
    instagramUrl: normalizeSocialUrl(links.instagramUrl, "instagram"),
    tiktokUrl: normalizeSocialUrl(links.tiktokUrl, "tiktok"),
    youtubeUrl: normalizeSocialUrl(links.youtubeUrl, "youtube"),
    hudlUrl: normalizeSocialUrl(links.hudlUrl, "hudl"),
    xUrl: normalizeSocialUrl(links.xUrl, "x"),
  };
}

export const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  platform: SocialPlatform;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "instagramUrl",
    platform: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourhandle",
  },
  {
    key: "tiktokUrl",
    platform: "tiktok",
    label: "TikTok",
    placeholder: "tiktok.com/@yourhandle",
  },
  {
    key: "youtubeUrl",
    platform: "youtube",
    label: "YouTube",
    placeholder: "youtube.com/@yourchannel",
  },
  {
    key: "hudlUrl",
    platform: "hudl",
    label: "Hudl",
    placeholder: "hudl.com/profile/...",
  },
  {
    key: "xUrl",
    platform: "x",
    label: "X (Twitter)",
    placeholder: "x.com/yourhandle",
  },
];

export function hasSocialLinks(links: SocialLinks) {
  return SOCIAL_FIELDS.some((f) => links[f.key]);
}
