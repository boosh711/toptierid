"use client";

import { useTransition } from "react";

export function DemoLoginButton({ email }: { email: string }) {
  const [pending, start] = useTransition();

  return (
    <form
      action={`/api/auth/demo?email=${encodeURIComponent(email)}`}
      onSubmit={(e) => {
        e.preventDefault();
        start(() => {
          window.location.href = `/api/auth/demo?email=${encodeURIComponent(email)}`;
        });
      }}
    >
      <button type="submit" disabled={pending} className="btn-primary text-sm">
        {pending ? "..." : "Quick login"}
      </button>
    </form>
  );
}
