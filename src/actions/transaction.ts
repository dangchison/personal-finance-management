"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser, getAuthenticatedUserOrNull } from "@/lib/auth-helpers";
import { USER_SELECT_BASIC } from "@/lib/prisma-selects";
import { revalidateTransactionPages } from "@/lib/revalidation";
import {
  getAppMonthRange,
  getPreviousAppMonthRange,
  toAppEndOfDay,
  toAppStartOfDay,
} from "@/lib/app-time";
import { getScopeUserIds, isUserInSameFamily } from "@/lib/scope-users";
import { Category, Transaction, PaymentMethod, Prisma } from "@prisma/client";

export type TransactionWithCategory = Omit<Transaction, "amount"> & {
  amount: number;
  category: Category;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};

async function resolveAccessibleCategory(
  userId: string,
  categoryId: string,
  expectedType?: "INCOME" | "EXPENSE"
) {
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true },
  });

  if (!userRecord) return null;

  const visibilityConditions: Prisma.CategoryWhereInput[] = [{ isDefault: true }];
  if (userRecord.familyId) {
    visibilityConditions.push({ familyId: userRecord.familyId });
  }

  return prisma.category.findFirst({
    where: {
      id: categoryId,
      ...(expectedType ? { type: expectedType } : {}),
      OR: visibilityConditions,
    },
    select: { id: true },
  });
}


export async function createTransaction(data: {
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  date: Date;
  paymentMethod?: PaymentMethod;
  transferCode?: string;
}) {
  try {
    const user = await getAuthenticatedUser();
    const category = await resolveAccessibleCategory(user.id, data.categoryId, data.type);

    if (!category) {
      return { error: "Invalid category" };
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        description: data.description,
        type: data.type,
        categoryId: data.categoryId,
        date: data.date,
        userId: user.id,
        paymentMethod: data.paymentMethod || "CASH",
        transferCode: data.paymentMethod === "TRANSFER" ? data.transferCode : null,
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

  const conditions: Prisma.CategoryWhereInput[] = [{ isDefault: true }];
  if (userRecord?.familyId) {
    conditions.push({ familyId: userRecord.familyId });
  }

  const categories = await prisma.category.findMany({
    where: { OR: conditions },
    orderBy: { name: "asc" },
  });

  return categories;
}

export async function getTransactions(
  limit: number | undefined,
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
    const where: Prisma.TransactionWhereInput = {
      deletedAt: null,
    };

    // Date Filter
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = toAppStartOfDay(filters.startDate);
      if (filters.endDate) {
        where.date.lte = toAppEndOfDay(filters.endDate);
      }
    }

    // Category Filter
    if (filters.categoryId && filters.categoryId !== "all") {
      where.categoryId = filters.categoryId;
    }

    // Scope & Member Filter
    if (filters.scope === "family") {
      if (filters.memberId && filters.memberId !== "all") {
        const isSameFamily = await isUserInSameFamily(userId, filters.memberId);
        if (!isSameFamily) {
          // Member not found or not in family -> return empty for security
          return [];
        }
        where.userId = filters.memberId;
      } else {
        const familyUserIds = await getScopeUserIds(userId, "family");
        where.userId = { in: familyUserIds };
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
  } catch {
    return [];
  }
}

export async function getMonthlyStats() {
  try {
    const user = await getAuthenticatedUser();

    const { start, end } = getAppMonthRange();
    const { start: startPrev, end: endPrev } = getPreviousAppMonthRange();

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
  paymentMethod?: PaymentMethod;
  transferCode?: string;
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

    const category = await resolveAccessibleCategory(user.id, data.categoryId, data.type);
    if (!category) {
      return { error: "Invalid category" };
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: data.amount,
        description: data.description,
        type: data.type,
        category: { connect: { id: data.categoryId } },
        date: data.date,
        paymentMethod: data.paymentMethod,
        transferCode: data.paymentMethod === "TRANSFER" ? data.transferCode : null,
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
