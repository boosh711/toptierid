"use client";

import { useState, useCallback } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { isValidHex } from "@/lib/profile-colors";

type Tab = "accent" | "background";

type Props = {
  accentColor: string;
  backgroundColor: string;
  onAccentChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
  accentSwatches?: readonly { id: string; color: string; label?: string }[];
  backgroundSwatches?: readonly { id: string; color: string; label?: string }[];
};

export function ColorWheelPicker({
  accentColor,
  backgroundColor,
  onAccentChange,
  onBackgroundChange,
  accentSwatches = [],
  backgroundSwatches = [],
}: Props) {
  const [tab, setTab] = useState<Tab>("accent");

  const currentColor = tab === "accent" ? accentColor : backgroundColor;
  const onChange = tab === "accent" ? onAccentChange : onBackgroundChange;
  const swatches = tab === "accent" ? accentSwatches : backgroundSwatches;

  const handleSwatch = useCallback(
    (color: string) => {
      onChange(color);
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex rounded-lg border border-border p-1 text-sm">
        <button
          type="button"
          onClick={() => setTab("accent")}
          className={`flex-1 rounded-md py-1.5 font-semibold transition ${
            tab === "accent"
              ? "bg-brand text-white"
              : "text-muted hover:text-white"
          }`}
        >
          Accent
        </button>
        <button
          type="button"
          onClick={() => setTab("background")}
          className={`flex-1 rounded-md py-1.5 font-semibold transition ${
            tab === "background"
              ? "bg-brand text-white"
              : "text-muted hover:text-white"
          }`}
        >
          Background
        </button>
      </div>

      {/* Color wheel */}
      <div className="flex justify-center">
        <HexColorPicker
          color={isValidHex(currentColor) ? currentColor : "#1E6BD6"}
          onChange={onChange}
          style={{ width: "100%", maxWidth: 240, height: 180 }}
        />
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 shrink-0 rounded-lg border border-border"
          style={{ backgroundColor: currentColor }}
        />
        <div className="flex flex-1 items-center rounded-lg border border-border bg-surface-elevated px-3 py-2 font-mono text-sm text-white">
          <span className="text-muted">#</span>
          <HexColorInput
            color={isValidHex(currentColor) ? currentColor : "#1E6BD6"}
            onChange={onChange}
            prefixed={false}
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Quick-pick swatches */}
      {swatches.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted">Quick picks</p>
          <div className="grid grid-cols-10 gap-1.5">
            {swatches.map((s) => {
              const active = currentColor.toLowerCase() === s.color.toLowerCase();
              return (
                <button
                  key={s.id}
                  type="button"
                  title={s.label ?? s.id}
                  aria-label={s.label ?? s.id}
                  onClick={() => handleSwatch(s.color)}
                  className={`h-7 w-7 rounded-full border-2 transition hover:scale-110 ${
                    active
                      ? "border-white ring-2 ring-brand ring-offset-1 ring-offset-base scale-110"
                      : "border-transparent hover:border-white/40"
                  }`}
                  style={{ backgroundColor: s.color }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
