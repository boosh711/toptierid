"use server";

import { prisma } from "@top-tier-id/database";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function setUserAdmin(userId: string, isAdmin: boolean) {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Unauthorized");
  await prisma.user.update({ where: { id: userId }, data: { isAdmin } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (!session?.isAdmin) throw new Error("Unauthorized");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { ok: true };
}
