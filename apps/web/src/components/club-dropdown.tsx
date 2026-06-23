"use client";

import { useState, useRef, useEffect } from "react";
import { CLUB_ROSTER, type ClubEntry } from "@top-tier-id/types";

type Props = {
  value: string;
  onChange: (club: string, entry?: ClubEntry) => void;
  placeholder?: string;
};

export function ClubDropdown({ value, onChange, placeholder = "Search clubs…" }: Props) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deduplicate by name (some clubs appear in multiple leagues)
  const uniqueClubs = CLUB_ROSTER.reduce<ClubEntry[]>((acc, club) => {
    if (!acc.find((c) => c.name.toLowerCase() === club.name.toLowerCase())) {
      acc.push(club);
    }
    return acc;
  }, []);

  const filtered =
    query.trim().length === 0
      ? uniqueClubs.slice(0, 30) // show first 30 when empty
      : uniqueClubs
          .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 40);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const leagueBadgeColor = (league: string) => {
    if (league === "ECNL") return "bg-blue-500/20 text-blue-300";
    if (league === "GA") return "bg-green-500/20 text-green-300";
    return "bg-purple-500/20 text-purple-300"; // GA Aspire
  };

  const select = (club: ClubEntry) => {
    setQuery(club.name);
    onChange(club.name, club);
    setOpen(false);
  };

  const clear = () => {
    setQuery("");
    onChange("", undefined);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange("", undefined);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="input w-full pr-8"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 text-muted hover:text-white"
            aria-label="Clear"
          >
            ×
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-surface-elevated shadow-xl">
          {filtered.map((club, i) => (
            <li key={`${club.name}-${club.league}-${i}`}>
              <button
                type="button"
                onClick={() => select(club)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-white/5"
              >
                <span className="flex-1 font-medium text-white">{club.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${leagueBadgeColor(club.league)}`}
                >
                  {club.league}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {club.city}, {club.state}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.length > 1 && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-3 text-sm text-muted shadow-xl">
          No clubs found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
