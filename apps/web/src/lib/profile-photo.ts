export function getProfilePhotoUrl(
  profileId: string,
  photoUrl: string | null | undefined,
  cacheKey?: string | number
): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("data:")) {
    const suffix = cacheKey != null ? `?v=${cacheKey}` : "";
    return `/api/profile-photo/${profileId}${suffix}`;
  }
  return photoUrl;
}

export function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}
