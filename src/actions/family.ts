"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { USER_SELECT, FAMILY_WITH_USERS_SELECT, USER_SELECT_BASIC } from "@/lib/prisma-selects";
import { revalidateDashboard } from "@/lib/revalidation";

export async function createFamily(name: string) {
  try {
    const user = await getAuthenticatedUser();

    const family = await prisma.family.create({
      data: {
        name,
        users: {
          connect: { id: user.id },
        },
      },
      ...FAMILY_WITH_USERS_SELECT,
    });

    revalidateDashboard();
    return { data: family };
  } catch (error) {
    console.error("Error creating family:", error);
    return { error: error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : "Failed to create family" };
  }
}

export async function joinFamily(inviteCode: string) {
  try {
    const user = await getAuthenticatedUser();

    const family = await prisma.family.findUnique({
      where: { inviteCode },
    });

    if (!family) {
      return { error: "Không tìm thấy gia đình với mã mời này" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { familyId: family.id },
    });

    // Re-fetch family with users to return complete data
    const updatedFamily = await prisma.family.findUnique({
      where: { id: family.id },
      ...FAMILY_WITH_USERS_SELECT,
    });

    revalidateDashboard();
    return { data: updatedFamily };
  } catch (error) {
    console.error("Error joining family:", error);
    return { error: error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : "Failed to join family" };
  }
}

export async function leaveFamily() {
  try {
    const user = await getAuthenticatedUser();

    await prisma.user.update({
      where: { id: user.id },
      data: { familyId: null },
    });

    revalidateDashboard();
    return { success: true };
  } catch (error) {
    console.error("Error leaving family:", error);
    return { error: error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : "Failed to leave family" };
  }
}

export async function getFamily() {
  try {
    const authUser = await getAuthenticatedUser();

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        family: FAMILY_WITH_USERS_SELECT,
      },
    });

    return user?.family || null;
  } catch (error) {
    console.error("Error fetching family:", error);
    return null;
  }
}

export async function getFamilyMembers(): Promise<{ id: string; name: string | null; image: string | null }[]> {
  try {
    const authUser = await getAuthenticatedUser();

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { familyId: true },
    });

    if (!user?.familyId) return [];

    const members = await prisma.user.findMany({
      where: { familyId: user.familyId },
      select: USER_SELECT_BASIC,
    });

    return members;
  } catch (error) {
    console.error("Error fetching family members:", error);
    return [];
  }
}
