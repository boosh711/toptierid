"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useTransition } from "react";
import { sendMessage } from "@/app/actions";

type Message = {
  id: string;
  body: string;
  createdAt: Date;
  sender: { id: string; firstName: string; lastName: string };
};

export function ThreadView({
  threadId,
  messages,
  currentUserId,
  backHref,
}: {
  threadId: string;
  messages: Message[];
  currentUserId: string;
  backHref: string;
}) {
  const [pending, start] = useTransition();

  return (
    <div>
      <Link href={backHref} className="text-sm text-brand">← Back</Link>
      <div className="card mt-4 max-h-[50vh] space-y-3 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg p-3 text-sm ${
              m.sender.id === currentUserId
                ? "ml-8 bg-brand/10"
                : "mr-8 bg-slate-100"
            }`}
          >
            <p className="text-xs font-medium text-slate-500">
              {m.sender.firstName} {m.sender.lastName} · {format(m.createdAt, "h:mm a")}
            </p>
            <p className="mt-1">{m.body}</p>
          </div>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          start(async () => {
            await sendMessage({ threadId, body: String(fd.get("body")) });
            e.currentTarget.reset();
            window.location.reload();
          });
        }}
      >
        <input name="body" className="input flex-1" placeholder="Type a message..." required />
        <button type="submit" disabled={pending} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
