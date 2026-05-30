import Link from "next/link";
import { Logo } from "@/components/logo";
import { signupAction } from "@/app/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const roleParam = sp.role;
  const defaultRole = roleParam === "coach" ? "COACH" : roleParam === "parent" ? "PARENT" : "ATHLETE";

  return (
    <div className="flex min-h-[calc(100vh-40px)] items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 page-title">Create account</h1>
        </div>
        {sp.error && (
          <p className="mb-4 rounded-lg alert-error">{sp.error}</p>
        )}
        <form action={signupAction} className="space-y-4">
          <div>
            <label className="label" htmlFor="role">I am a</label>
            <select id="role" name="role" defaultValue={defaultRole} className="input">
              <option value="ATHLETE">Athlete</option>
              <option value="PARENT">Parent / Guardian</option>
              <option value="COACH">College Coach</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" required className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" minLength={6} required className="input" />
          </div>
          <button type="submit" className="btn-primary w-full">Create account</button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
