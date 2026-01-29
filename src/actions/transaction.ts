"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { Category, Transaction } from "@prisma/client";

export type TransactionWithCategory = Omit<Transaction, "amount"> & {
  amount: number;
  category: Category;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};


export async function createTransaction(data: {
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: Date;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return { error: "Unauthorized" };
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
        userId: (session.user as any).id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return {
      success: true,
      data: {
        ...transaction,
        amount: transaction.amount.toNumber()
      }
    };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { error: "Failed to create transaction" };
  }
}

export async function getCategories() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  // Get default categories and custom categories for the user's family
  // For MVP, just get default ones + current user family ones if user has family
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { familyId: true }
  });

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { isDefault: true },
        { familyId: user?.familyId || "hmmm-invalid-uuid" } // fallback
      ]
    },
    orderBy: { name: 'asc' }
  });

  return categories;
}

export async function getTransactions(
  limit = 20,
  offset = 0,
  filters: {
    scope?: "personal" | "family";
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    memberId?: string;
  } = {}
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return [];
  }

  const userId = (session.user as any).id;
  let where: any = {
    deletedAt: null,
  };

  // Date Filter
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      where.date.lte = endOfDay;
    }
  }

  // Category Filter
  if (filters.categoryId && filters.categoryId !== "all") {
    where.categoryId = filters.categoryId;
  }

  // Scope & Member Filter
  if (filters.scope === "family") {
    // Get user's family
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    });

    if (user?.familyId) {
      if (filters.memberId && filters.memberId !== "all") {
        // specific member - verify they are in the family
        const member = await prisma.user.findFirst({
          where: { id: filters.memberId, familyId: user.familyId }
        });
        if (member) {
          where.userId = filters.memberId;
        } else {
          // Member not found or not in family -> return empty or fallback? 
          // Let's return empty for security
          return [];
        }
      } else {
        // All family members
        const familyUsers = await prisma.user.findMany({
          where: { familyId: user.familyId },
          select: { id: true }
        });
        const familyUserIds = familyUsers.map(u => u.id);
        where.userId = { in: familyUserIds };
      }
    } else {
      // Fallback to personal if no family
      where.userId = userId;
    }
  } else {
    // Personal scope
    where.userId = userId;
  }

  console.log("getTransactions Filters:", filters);
  console.dir(where, { depth: null });

  try {
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return transactions.map((t) => ({
      ...t,
      amount: t.amount.toNumber(),
    })) as TransactionWithCategory[];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}

export async function getMonthlyStats() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return { income: 0, expense: 0 };
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const aggregates = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId: (session.user as any).id,
      deletedAt: null,
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const income = aggregates.find(a => a.type === 'INCOME')?._sum.amount?.toNumber() || 0;
  const expense = aggregates.find(a => a.type === 'EXPENSE')?._sum.amount?.toNumber() || 0;

  return { income, expense };
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return { error: "Unauthorized" };
  }

  try {
    // Check ownership first
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== (session.user as any).id) {
      return { error: "Not found or unauthorized" };
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return { error: "Failed to delete transaction" };
  }
}

export async function updateTransaction(id: string, data: {
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: Date;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    return { error: "Unauthorized" };
  }

  try {
    // Check ownership
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== (session.user as any).id) {
      return { error: "Not found or unauthorized" };
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: data.amount,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return {
      success: true,
      data: {
        ...transaction,
        amount: transaction.amount.toNumber()
      }
    };
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return { error: "Failed to update transaction" };
  }
}
