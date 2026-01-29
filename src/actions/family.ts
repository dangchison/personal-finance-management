"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createFamily(name: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const userId = (session.user as any).id;

  try {
    const family = await prisma.family.create({
      data: {
        name,
        users: {
          connect: { id: userId },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    return { data: family };
  } catch (error) {
    console.error("Error creating family:", error);
    return { error: "Failed to create family" };
  }
}

export async function joinFamily(inviteCode: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const userId = (session.user as any).id;

  try {
    const family = await prisma.family.findUnique({
      where: { inviteCode },
    });

    if (!family) {
      return { error: "Không tìm thấy gia đình với mã mời này" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { familyId: family.id },
    });

    // Re-fetch family with users to return complete data
    const updatedFamily = await prisma.family.findUnique({
      where: { id: family.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/dashboard");
    return { data: updatedFamily };
  } catch (error) {
    console.error("Error joining family:", error);
    return { error: "Failed to join family" };
  }
}

export async function leaveFamily() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const userId = (session.user as any).id;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { familyId: null },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error leaving family:", error);
    return { error: "Failed to leave family" };
  }
}

export async function getFamily() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }

  const userId = (session.user as any).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        family: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return user?.family || null;
  } catch (error) {
    console.error("Error fetching family:", error);
    return null;
  }
}

export async function getFamilyMembers(): Promise<{ id: string; name: string | null; image: string | null }[]> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return [];
  }

  const userId = (session.user as any).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true },
    });

    if (!user?.familyId) return [];

    const members = await prisma.user.findMany({
      where: { familyId: user.familyId },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    return members;
  } catch (error) {
    console.error("Error fetching family members:", error);
    return [];
  }
}
