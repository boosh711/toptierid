"use client";

import { useState } from "react";

export function CalendarSyncPanel({ icsUrl }: { icsUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(icsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card mt-6 border-accent/30 bg-accent/10">
      <h2 className="font-semibold text-accent">Sync to your phone</h2>
      <p className="mt-2 text-sm text-muted">
        Subscribe to this calendar feed in Google Calendar or iPhone Calendar (Add Calendar Subscription).
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className="btn-primary min-h-[44px]">
          {copied ? "Copied!" : "Copy calendar URL"}
        </button>
        <a href={icsUrl} download className="btn-secondary min-h-[44px] flex items-center">
          Download .ics
        </a>
      </div>
      <p className="mt-3 break-all text-xs text-muted">{icsUrl}</p>
      <p className="mt-2 text-xs text-accent">
        Google / Apple OAuth sync is stubbed — use webcal subscription for this prototype.
      </p>
    </div>
  );
}
