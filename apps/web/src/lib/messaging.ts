import { prisma } from "@top-tier-id/database";

export async function getThreadsForAthlete(athleteProfileId: string) {
  return prisma.messageThread.findMany({
    where: {
      participants: { some: { athleteProfileId } },
    },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: true } },
      participants: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getThreadsForCoach(coachUserId: string) {
  return prisma.messageThread.findMany({
    where: {
      messages: { some: { senderId: coachUserId } },
    },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: true } },
      participants: { include: { athleteProfile: { include: { user: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getThreadMessages(threadId: string) {
  return prisma.message.findMany({
    where: { threadId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });
}
