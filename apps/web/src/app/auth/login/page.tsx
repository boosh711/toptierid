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
          <h1 className="mt-4 font-display text-2xl">Welcome back</h1>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid email or password
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
        <p className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link href="/auth/signup" className="text-brand hover:underline">
            Sign up
          </Link>
          {" · "}
          <Link href="/auth/demo" className="text-brand hover:underline">
            Demo logins
          </Link>
        </p>
      </div>
    </div>
  );
}
