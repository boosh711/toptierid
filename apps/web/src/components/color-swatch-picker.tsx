"use client";

import { useState } from "react";
import { isValidHex } from "@/lib/profile-colors";

type Swatch = { id: string; color: string; label?: string };

export function ColorSwatchPicker({
  swatches,
  selected,
  onSelect,
  size = "md",
  showCustom = false,
}: {
  swatches: readonly Swatch[];
  selected: string;
  onSelect: (color: string) => void;
  size?: "sm" | "md";
  showCustom?: boolean;
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const [customHex, setCustomHex] = useState("");
  const [customError, setCustomError] = useState("");

  const handleCustomApply = () => {
    const val = customHex.startsWith("#") ? customHex : `#${customHex}`;
    if (!isValidHex(val)) {
      setCustomError("Enter a valid 6-digit hex (e.g. #FF5500)");
      return;
    }
    setCustomError("");
    onSelect(val.toUpperCase());
    setCustomHex("");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
        {swatches.map((s) => {
          const active = selected.toLowerCase() === s.color.toLowerCase();
          return (
            <button
              key={s.id}
              type="button"
              title={s.label ?? s.id}
              aria-label={s.label ?? s.id}
              onClick={() => onSelect(s.color)}
              className={`${dim} rounded-full border-2 transition hover:scale-110 ${
                active
                  ? "border-white ring-2 ring-brand ring-offset-2 ring-offset-base scale-110"
                  : "border-transparent hover:border-white/40"
              }`}
              style={{ backgroundColor: s.color }}
            />
          );
        })}
      </div>

      {showCustom && (
        <div>
          <label className="label">Custom color</label>
          <div className="flex items-center gap-2">
            {/* Preview swatch */}
            <div
              className="h-9 w-9 shrink-0 rounded-lg border border-border"
              style={{
                backgroundColor:
                  isValidHex(customHex.startsWith("#") ? customHex : `#${customHex}`)
                    ? customHex.startsWith("#")
                      ? customHex
                      : `#${customHex}`
                    : "#1E6BD6",
              }}
            />
            <input
              type="text"
              value={customHex}
              onChange={(e) => {
                setCustomHex(e.target.value);
                setCustomError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCustomApply())}
              placeholder="#FF5500"
              maxLength={7}
              className="input flex-1 font-mono text-sm"
            />
            <button
              type="button"
              onClick={handleCustomApply}
              className="btn-secondary shrink-0 text-xs"
            >
              Apply
            </button>
          </div>
          {customError && (
            <p className="mt-1 text-xs text-red-400">{customError}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function DivisionPills({
  selected,
  onChange,
  options,
}: {
  selected: string[];
  onChange: (divisions: string[]) => void;
  options: readonly string[];
}) {
  const toggle = (d: string) => {
    onChange(selected.includes(d) ? selected.filter((x) => x !== d) : [...selected, d]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((d) => {
        const active = selected.includes(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => toggle(d)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-2 border-brand-light bg-brand/20 text-brand-light"
                : "border border-border bg-surface-elevated text-muted hover:border-border-strong"
            }`}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}
