"use client";

import { useTransition } from "react";
import { uploadHighlight, deleteHighlight } from "@/app/actions";

type Highlight = { id: string; title: string; url: string };

export function HighlightsManager({
  highlights,
  isPremium,
}: {
  highlights: Highlight[];
  isPremium: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="mt-8 space-y-6">
      <form
        className="card space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            const res = await uploadHighlight(fd);
            if (res?.error) alert(res.error);
            else e.currentTarget.reset();
          });
        }}
      >
        <h2 className="font-semibold">Add highlight</h2>
        <input name="title" placeholder="Title" className="input" required />
        <input name="file" type="file" accept="video/*" className="input" required />
        <button type="submit" disabled={pending} className="btn-primary">
          Upload video
        </button>
        {!isPremium && highlights.length >= 1 && (
          <p className="text-sm text-brand-light">Free tier limit reached.</p>
        )}
      </form>

      <div className="space-y-4">
        {highlights.map((h) => (
          <div key={h.id} className="card">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{h.title}</h3>
              <button
                type="button"
                onClick={() => start(async () => { await deleteHighlight(h.id); })}
                className="text-sm text-red-400"
              >
                Delete
              </button>
            </div>
            <video src={h.url} controls className="mt-3 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
