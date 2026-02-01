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

    // Adjust for UTC+7 (Vietnam Time) to capture transactions made in local time
    const TIMEZONE_OFFSET_HOURS = 7;
    const offsetMs = TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;

    // Calculate "Vietnam Now" first to identify correct Month/Year
    const nowVn = new Date(now.getTime() + offsetMs);
    const vnYear = nowVn.getUTCFullYear();
    const vnMonth = nowVn.getUTCMonth();

    // Current Month (VN -> UTC)
    // Feb 1 00:00 VN corresponds to Date.UTC(2026, 1, 1) - 7h
    const start = new Date(Date.UTC(vnYear, vnMonth, 1) - offsetMs);
    const end = new Date(Date.UTC(vnYear, vnMonth + 1, 0, 23, 59, 59, 999) - offsetMs);

    // Previous Month (VN -> UTC)
    const startPrev = new Date(Date.UTC(vnYear, vnMonth - 1, 1) - offsetMs);
    const endPrev = new Date(Date.UTC(vnYear, vnMonth, 0, 23, 59, 59, 999) - offsetMs);

    const aggregates = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
        deletedAt: null,
        date: {
          gte: startPrev, // Fetch from start of previous month
          lte: end,       // To end of current month
        },
      },
      _sum: {
        amount: true,
      },
    });

    // We need to group by month to separate them, OR we can run two queries.
    // groupBy doesn't support grouping by date trunc easily in Prisma without raw query.
    // Two queries is cleaner for maintainability and small scale.

    // Query 1: Current Month
    const currentStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
        deletedAt: null,
        date: { gte: start, lte: end },
      },
      _sum: { amount: true },
    });

    // Query 2: Previous Month
    const prevStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: user.id,
        deletedAt: null,
        date: { gte: startPrev, lte: endPrev },
      },
      _sum: { amount: true },
    });

    const income = currentStats.find(a => a.type === 'INCOME')?._sum.amount?.toNumber() || 0;
    const expense = currentStats.find(a => a.type === 'EXPENSE')?._sum.amount?.toNumber() || 0;

    const previousIncome = prevStats.find(a => a.type === 'INCOME')?._sum.amount?.toNumber() || 0;
    const previousExpense = prevStats.find(a => a.type === 'EXPENSE')?._sum.amount?.toNumber() || 0;

    return {
      income,
      expense,
      previousIncome,
      previousExpense
    };
  } catch (error) {
    console.error("Failed to fetch monthly stats:", error);
    return { income: 0, expense: 0, previousIncome: 0, previousExpense: 0 };
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
