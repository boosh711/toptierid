import Link from "next/link";
import { Logo } from "@/components/logo";
import { DemoLoginButton } from "./demo-login-button";

const demos = [
  { label: "Athlete — Jordan Smith", email: "athlete@demo.com", role: "Premium athlete with full profile" },
  { label: "Parent — Chris Smith", email: "parent@demo.com", role: "Linked to Jordan Smith" },
  { label: "Coach — Sarah Mitchell (Head)", email: "coach.head@demo.com", role: "State University program" },
  { label: "Coach — James Rivera (Asst)", email: "coach.asst@demo.com", role: "Same program staff board" },
];

export default function DemoPage() {
  return (
    <div className="flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-8">
      <div className="card w-full max-w-lg">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 page-title">Demo accounts</h1>
          <p className="mt-2 text-sm text-muted">
            Password for all: <code className="rounded bg-surface-elevated px-1">demo1234</code>
            <br />
            Run <code className="rounded bg-surface-elevated px-1">pnpm db:seed</code> if accounts are missing.
          </p>
        </div>
        <div className="space-y-3">
          {demos.map((d) => (
            <div key={d.email} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="font-medium">{d.label}</p>
                <p className="text-xs text-muted">{d.role}</p>
              </div>
              <DemoLoginButton email={d.email} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/auth/login" className="text-accent hover:underline">
            Manual login
          </Link>
        </p>
      </div>
    </div>
  );
}
