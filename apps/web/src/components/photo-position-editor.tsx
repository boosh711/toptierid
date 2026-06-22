"use client";

import { useCallback, useRef, useState } from "react";
import {
  HERO_FRAME_CLASS,
  type PhotoPosition,
  clampPhotoPosition,
  photoObjectPosition,
} from "@/lib/profile-hero";

export function PhotoPositionEditor({
  imageUrl,
  position,
  onChange,
  onSave,
  saving = false,
}: {
  imageUrl: string;
  position: PhotoPosition;
  onChange: (pos: PhotoPosition) => void;
  onSave: () => void;
  saving?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      onChange({ ...position, ...clampPhotoPosition(x, y) });
    },
    [onChange, position]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setFromPointer(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setFromPointer(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const scale = position.scale ?? 1;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        Drag the preview to reposition your photo. Use sliders to fine-tune position and zoom.
      </p>
      <div
        ref={frameRef}
        className={`relative cursor-crosshair overflow-hidden rounded-xl border border-border bg-black ${HERO_FRAME_CLASS.compact}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="Adjust photo position"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: photoObjectPosition(position),
            transform: `scale(${scale})`,
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            boxShadow: "0 0 0 2px rgba(0,0,0,0.4)",
          }}
          aria-hidden
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label flex justify-between">
            <span>Horizontal</span>
            <span className="text-muted">{position.x}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={position.x}
            onChange={(e) =>
              onChange({ ...position, ...clampPhotoPosition(Number(e.target.value), position.y) })
            }
            className="w-full accent-brand"
          />
        </div>
        <div>
          <label className="label flex justify-between">
            <span>Vertical</span>
            <span className="text-muted">{position.y}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={position.y}
            onChange={(e) =>
              onChange({ ...position, ...clampPhotoPosition(position.x, Number(e.target.value)) })
            }
            className="w-full accent-brand"
          />
        </div>
      </div>

      <div>
        <label className="label flex justify-between">
          <span>Zoom</span>
          <span className="text-muted">{scale.toFixed(2)}×</span>
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={scale}
          onChange={(e) =>
            onChange({ ...position, scale: Number(e.target.value) })
          }
          className="w-full accent-brand"
        />
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="btn-secondary w-full"
      >
        {saving ? "Saving…" : "Save photo position & zoom"}
      </button>
    </div>
  );
}
