"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser, getAuthenticatedUserOrNull } from "@/lib/auth-helpers";
import { USER_SELECT_BASIC } from "@/lib/prisma-selects";
import { revalidateTransactionPages } from "@/lib/revalidation";
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
  try {
    const user = await getAuthenticatedUser();

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
        userId: user.id,
      },
    });

    revalidateTransactionPages();
    return {
      success: true,
      data: {
        ...transaction,
        amount: transaction.amount.toNumber()
      }
    };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { error: error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : "Failed to create transaction" };
  }
}

export async function getCategories() {
  const user = await getAuthenticatedUserOrNull();
  if (!user) return [];

  // Get default categories and custom categories for the user's family
  const userRecord = await prisma.user.findUnique({
    where: { id: user.id },
    select: { familyId: true }
  });

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { isDefault: true },
        { familyId: userRecord?.familyId || "hmmm-invalid-uuid" }
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
  try {
    const user = await getAuthenticatedUser();
    const userId = user.id;
    const where: any = {
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

    try {
      const transactions = await prisma.transaction.findMany({
        where,
        include: {
          category: true,
          user: {
            select: USER_SELECT_BASIC,
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
  } catch (error) {
    return [];
  }
}

export async function getMonthlyStats() {
  try {
    const user = await getAuthenticatedUser();

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const aggregates = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
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
  } catch (error) {
    console.error("Failed to fetch monthly stats:", error);
    return { income: 0, expense: 0 };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const user = await getAuthenticatedUser();

    // Check ownership first
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return { error: "Not found or unauthorized" };
    }

    await prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidateTransactionPages();
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return { error: error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : "Failed to delete transaction" };
  }
}

export async function updateTransaction(id: string, data: {
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: Date;
}) {
  try {
    const user = await getAuthenticatedUser();

    // Check ownership
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
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

    revalidateTransactionPages();
    return {
      success: true,
      data: {
        ...transaction,
        amount: transaction.amount.toNumber()
      }
    };
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return { error: error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : "Failed to update transaction" };
  }
}
