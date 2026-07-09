"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PhotoPosition } from "@/lib/profile-hero";

/**
 * LinkedIn-style photo editor.
 * Shows a fixed crop window — user drags the photo around inside it
 * and uses scroll wheel (or +/- buttons) to zoom.
 * No sliders.
 */
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
  const imgRef = useRef<HTMLImageElement>(null);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Internal state for smooth dragging — sync to parent on pointer-up
  const [localPos, setLocalPos] = useState<PhotoPosition>(position);

  // Keep local in sync if parent changes externally (e.g. new photo upload)
  useEffect(() => {
    setLocalPos(position);
  }, [position.x, position.y, position.scale]); // eslint-disable-line react-hooks/exhaustive-deps

  const scale = localPos.scale ?? 1;

  /** Clamp translation so image always fully covers the frame */
  const clamp = useCallback(
    (x: number, y: number, s: number): PhotoPosition => {
      const maxOffset = ((s - 1) / 2) * 100;
      return {
        x: Math.min(50 + maxOffset, Math.max(50 - maxOffset, x)),
        y: Math.min(50 + maxOffset, Math.max(50 - maxOffset, y)),
        scale: Math.min(3, Math.max(1, s)),
      };
    },
    []
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const dx = ((e.clientX - lastPointer.current.x) / rect.width) * 100;
    const dy = ((e.clientY - lastPointer.current.y) / rect.height) * 100;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    setLocalPos((prev) => {
      const s = prev.scale ?? 1;
      // Moving pointer right → image should shift right → x increases
      return clamp(prev.x - dx, prev.y - dy, s);
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setLocalPos((prev) => {
      onChange(prev);
      return prev;
    });
  };

  /** Scroll wheel to zoom */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setLocalPos((prev) => {
        const next = clamp(prev.x, prev.y, (prev.scale ?? 1) + delta);
        return next;
      });
    },
    [clamp]
  );

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const adjustZoom = (delta: number) => {
    setLocalPos((prev) => {
      const next = clamp(prev.x, prev.y, (prev.scale ?? 1) + delta);
      onChange(next);
      return next;
    });
  };

  // Convert x/y (0-100 position where 50=center) to CSS translate
  // At scale S, the image is S× the container. We offset from center.
  const translateX = ((50 - localPos.x) * scale).toFixed(2);
  const translateY = ((50 - localPos.y) * scale).toFixed(2);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        Drag to reposition · scroll to zoom · photo always fills the frame
      </p>

      {/* Crop window */}
      <div className="relative overflow-hidden rounded-xl border-2 border-brand/60 shadow-brand"
        style={{ aspectRatio: "4/5", maxHeight: "420px", cursor: dragging.current ? "grabbing" : "grab" }}
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          style={{
            objectFit: "cover",
            transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`,
            transformOrigin: "center center",
          }}
          draggable={false}
        />

        {/* Corner guides — subtle crop indicators */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
          <div
            key={pos}
            className={`pointer-events-none absolute ${pos} h-6 w-6`}
            style={{
              borderColor: "rgba(255,255,255,0.6)",
              borderWidth: pos.includes("right") ? "0 2px 0 0" : "0 0 0 2px",
              borderTopWidth: pos.includes("top") ? "2px" : "0",
              borderBottomWidth: pos.includes("bottom") ? "2px" : "0",
            }}
          />
        ))}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => adjustZoom(-0.15)}
          disabled={scale <= 1}
          className="btn-secondary h-9 w-9 rounded-full text-lg leading-none disabled:opacity-30"
          aria-label="Zoom out"
        >
          −
        </button>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-surface-elevated">
            <div
              className="h-1.5 rounded-full bg-brand transition-all"
              style={{ width: `${((scale - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => adjustZoom(0.15)}
          disabled={scale >= 3}
          className="btn-secondary h-9 w-9 rounded-full text-lg leading-none disabled:opacity-30"
          aria-label="Zoom in"
        >
          +
        </button>
        <span className="w-10 text-right text-xs text-muted">{scale.toFixed(1)}×</span>
      </div>

      <button
        type="button"
        onClick={() => {
          onChange(localPos);
          onSave();
        }}
        disabled={saving}
        className="btn-primary w-full"
      >
        {saving ? "Saving…" : "Save crop"}
      </button>
    </div>
  );
}
