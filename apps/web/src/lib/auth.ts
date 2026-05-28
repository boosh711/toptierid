import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma, UserRole } from "@top-tier-id/database";

const COOKIE = "tti_session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-in-production-min-32-chars"
);

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  athleteProfileId?: string;
  coachProfileId?: string;
};

async function enrichUser(userId: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { athleteProfile: true, coachProfile: true },
  });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    athleteProfileId: user.athleteProfile?.id,
    coachProfileId: user.coachProfile?.id,
  };
}

export async function createSession(userId: string) {
  const user = await enrichUser(userId);
  if (!user) throw new Error("User not found");

  const token = await new SignJWT({ sub: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return user;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = payload.sub;
    if (!sub || typeof sub !== "string") return null;
    return enrichUser(sub);
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return createSession(user.id);
}

export async function registerUser(data: {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      ...(data.role === "COACH"
        ? {
            coachProfile: {
              create: { college: "", title: "Coach", isVerified: true },
            },
          }
        : {}),
      ...(data.role === "ATHLETE"
        ? {
            athleteProfile: {
              create: {
                slug: `${data.firstName}-${data.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                onboardingStep: 1,
              },
            },
          }
        : {}),
    },
  });

  return createSession(user.id);
}

export function roleHomePath(role: UserRole) {
  switch (role) {
    case "ATHLETE":
      return "/athlete";
    case "PARENT":
      return "/parent";
    case "COACH":
      return "/coach";
    default:
      return "/";
  }
}

/** Stub NCAA gate: coaches cannot initiate contact with grad year > 2 years out in demo */
export function canCoachContactAthlete(coachRole: UserRole, gradYear: number | null) {
  if (coachRole !== "COACH") return true;
  if (!gradYear) return true;
  const currentYear = new Date().getFullYear();
  return gradYear <= currentYear + 2;
}
