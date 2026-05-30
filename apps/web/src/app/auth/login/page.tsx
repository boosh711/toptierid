import Link from "next/link";
import { Logo } from "@/components/logo";
import { loginAction } from "@/app/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-[calc(100vh-40px)] items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-4 page-title">Welcome back</h1>
        </div>
        {error === "invalid" && (
          <p className="mb-4 rounded-lg alert-error">
            Invalid email or password. Demo: athlete@demo.com / demo1234 (requires database seed).
          </p>
        )}
        {error === "server" && (
          <p className="mb-4 rounded-lg alert-error">
            Could not reach the database. Check Vercel env vars (DATABASE_URL) and run db:push + db:seed.
            Visit /api/health for details.
          </p>
        )}
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="input" />
          </div>
          <button type="submit" className="btn-primary w-full">Log in</button>
        </form>
        <p className="mt-4 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/auth/signup" className="text-accent hover:underline">
            Sign up
          </Link>
          {" · "}
          <Link href="/auth/demo" className="text-accent hover:underline">
            Demo logins
          </Link>
        </p>
      </div>
    </div>
  );
}
