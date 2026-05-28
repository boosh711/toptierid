"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SOCCER_POSITIONS, GRAD_YEARS } from "@top-tier-id/types";

export function DiscoverFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  return (
    <form
      className="card mt-6 grid gap-3 md:grid-cols-4 lg:grid-cols-6"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const params = new URLSearchParams();
        for (const [k, v] of fd.entries()) {
          if (v) params.set(k, String(v));
        }
        router.push(`/coach?${params.toString()}`);
      }}
    >
      <input name="q" placeholder="Search name, club..." defaultValue={sp.get("q") ?? ""} className="input md:col-span-2" />
      <select name="position" defaultValue={sp.get("position") ?? ""} className="input">
        <option value="">Position</option>
        {SOCCER_POSITIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <select name="gradYear" defaultValue={sp.get("gradYear") ?? ""} className="input">
        <option value="">Grad year</option>
        {GRAD_YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <input name="gpaMin" type="number" step="0.1" placeholder="Min GPA" defaultValue={sp.get("gpaMin") ?? ""} className="input" />
      <input name="state" placeholder="State" maxLength={2} defaultValue={sp.get("state") ?? ""} className="input" />
      <input name="club" placeholder="Club" defaultValue={sp.get("club") ?? ""} className="input md:col-span-2" />
      <button type="submit" className="btn-primary md:col-span-2">Apply filters</button>
    </form>
  );
}
