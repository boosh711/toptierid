import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "COACH") redirect("/auth/login");
  return <div className="min-h-screen bg-base">{children}</div>;
}
