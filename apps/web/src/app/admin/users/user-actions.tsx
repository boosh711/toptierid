"use client";

import { setUserAdmin, deleteUser } from "../actions";
import { useTransition } from "react";

export function UserActions({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <span className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setUserAdmin(userId, !isAdmin);
          })
        }
        className="rounded bg-surface px-2 py-1 text-xs hover:bg-surface-elevated disabled:opacity-50"
      >
        {isAdmin ? "Remove Admin" : "Make Admin"}
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (confirm("Delete this user? This cannot be undone.")) {
            startTransition(async () => {
              await deleteUser(userId);
            });
          }
        }}
        className="rounded bg-surface px-2 py-1 text-xs text-red-500 hover:bg-surface-elevated disabled:opacity-50"
      >
        Delete
      </button>
    </span>
  );
}
