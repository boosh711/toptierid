"use client";

import { useTransition } from "react";
import { linkParentByCode } from "@/app/actions";

export function LinkChildForm() {
  const [pending, start] = useTransition();

  return (
    <form
      className="card flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const code = String(new FormData(e.currentTarget).get("code"));
        start(async () => {
          const res = await linkParentByCode(code);
          if (res?.error) alert(res.error);
          else window.location.reload();
        });
      }}
    >
      <div className="flex-1">
        <label className="label">Link athlete (profile slug)</label>
        <input name="code" placeholder="jordan-smith" className="input" required />
      </div>
      <button type="submit" disabled={pending} className="btn-primary">
        Link child
      </button>
    </form>
  );
}
