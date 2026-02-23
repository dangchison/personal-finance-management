import prisma from "@/lib/prisma";

export type TransactionScope = "personal" | "family";

export async function getScopeUserIds(
  userId: string,
  scope: TransactionScope
): Promise<string[]> {
  if (scope !== "family") {
    return [userId];
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true },
  });

  if (!dbUser?.familyId) {
    return [userId];
  }

  const familyUsers = await prisma.user.findMany({
    where: { familyId: dbUser.familyId },
    select: { id: true },
  });

  const familyUserIds = familyUsers.map((u) => u.id);
  return familyUserIds.length > 0 ? familyUserIds : [userId];
}

export async function isUserInSameFamily(userId: string, candidateUserId: string): Promise<boolean> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true },
  });

  if (!dbUser?.familyId) return false;

  const candidate = await prisma.user.findFirst({
    where: { id: candidateUserId, familyId: dbUser.familyId },
    select: { id: true },
  });

  return !!candidate;
}
