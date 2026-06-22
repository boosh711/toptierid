/** Shared hero frame — keep editor picker and public profile in sync */
export const HERO_FRAME_CLASS = {
  /** Editor live preview — scales with column width, no max-height cap */
  compact: "aspect-[9/16] min-h-[22rem] w-full",
  /** Public Digital ID — tall phone-style hero */
  full: "aspect-[9/16] min-h-[34rem] w-full max-h-[min(94vh,56rem)] sm:min-h-[38rem]",
} as const;

export type PhotoPosition = {
  x: number;
  y: number;
  scale?: number;
};

export const DEFAULT_PHOTO_POSITION: PhotoPosition = { x: 50, y: 22 };

export function clampPhotoPosition(x: number, y: number, scale?: number): PhotoPosition {
  return {
    x: Math.min(100, Math.max(0, Math.round(x))),
    y: Math.min(100, Math.max(0, Math.round(y))),
    scale: scale !== undefined ? Math.min(3, Math.max(1, scale)) : undefined,
  };
}

export function photoObjectPosition(pos: PhotoPosition) {
  return `${pos.x}% ${pos.y}%`;
}

export function parsePhotoPosition(
  x: number | null | undefined,
  y: number | null | undefined
): PhotoPosition {
  return clampPhotoPosition(x ?? DEFAULT_PHOTO_POSITION.x, y ?? DEFAULT_PHOTO_POSITION.y);
}
