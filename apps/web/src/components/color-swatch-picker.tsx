"use client";

type Swatch = { id: string; color: string; label?: string };

export function ColorSwatchPicker({
  swatches,
  selected,
  onSelect,
  size = "md",
}: {
  swatches: readonly Swatch[];
  selected: string;
  onSelect: (color: string) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <div className="flex flex-wrap gap-3">
      {swatches.map((s) => {
        const active = selected.toLowerCase() === s.color.toLowerCase();
        return (
          <button
            key={s.id}
            type="button"
            title={s.label ?? s.id}
            aria-label={s.label ?? s.id}
            onClick={() => onSelect(s.color)}
            className={`${dim} rounded-full border-2 transition ${
              active ? "border-white ring-2 ring-brand ring-offset-2 ring-offset-base" : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: s.color }}
          />
        );
      })}
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
