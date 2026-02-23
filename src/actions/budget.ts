"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { Budget, Category, Prisma } from "@prisma/client";

// Define the shape of a Budget with relations and converted Decimal
export type BudgetWithCategory = Omit<Budget, "amount"> & {
  amount: number;
  categoryId: string;
  category: Category;
};

export type BudgetProgress = BudgetWithCategory & {
  spent: number;
  percentage: number;
  isOverBudget: boolean;
};

export async function upsertBudget(data: {
  amount: number;
  categoryId: string;
}) {
  try {
    const user = await getAuthenticatedUser();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { familyId: true }
    });

    const familyId = dbUser?.familyId;
    const whereClause: Prisma.BudgetWhereInput = {
      categoryId: data.categoryId,
      userId: user.id,
    };

    // Explicitly handle familyId for unique constraint lookup if needed, 
    // though findFirst with explicit nullable check is safer.
    if (familyId) {
      whereClause.familyId = familyId;
    } else {
      whereClause.familyId = null;
    }

    const existingBudget = await prisma.budget.findFirst({
      where: whereClause
    });

    if (existingBudget) {
      await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { amount: data.amount }
      });
    } else {
      await prisma.budget.create({
        data: {
          amount: data.amount,
          categoryId: data.categoryId,
          userId: user.id,
          familyId: familyId,
        }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/budget");
    return { success: true };
  } catch (error) {
    console.error("Failed to upsert budget:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { error: "Bạn cần đăng nhập lại" };
    }
    return { error: "Failed to save budget" };
  }
}

export async function getBudgets(): Promise<BudgetWithCategory[]> {
  try {
    const user = await getAuthenticatedUser();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { familyId: true }
    });

    const budgets = await prisma.budget.findMany({
      where: {
        OR: [
          { userId: user.id },
          ...(dbUser?.familyId ? [{ familyId: dbUser.familyId }] : [])
        ]
      },
      include: {
        category: true
      }
    });

    return budgets.map((b) => ({
      ...b,
      amount: b.amount.toNumber()
    }));
  } catch (error) {
    console.error("Failed to get budgets:", error);
    return [];
  }
}

export async function getBudgetProgress(): Promise<BudgetProgress[]> {
  try {
    const user = await getAuthenticatedUser();

    const budgets = await getBudgets();
    if (budgets.length === 0) return [];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const familyIds = Array.from(
      new Set(
        budgets
          .map((b) => b.familyId)
          .filter((id): id is string => !!id)
      )
    );

    const familyUsers = familyIds.length > 0
      ? await prisma.user.findMany({
          where: { familyId: { in: familyIds } },
          select: { id: true, familyId: true },
        })
      : [];

    const familyUserMap = new Map<string, string[]>();
    familyUsers.forEach((member) => {
      if (!member.familyId) return;
      const current = familyUserMap.get(member.familyId) || [];
      current.push(member.id);
      familyUserMap.set(member.familyId, current);
    });

    const personalCategoryIds = Array.from(
      new Set(
        budgets
          .filter((b) => !b.familyId)
          .map((b) => b.categoryId)
      )
    );

    const personalSpentMap = new Map<string, number>();
    if (personalCategoryIds.length > 0) {
      const personalAggregates = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          categoryId: { in: personalCategoryIds },
          type: "EXPENSE",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          deletedAt: null,
          userId: user.id,
        },
        _sum: { amount: true },
      });

      personalAggregates.forEach((item) => {
        personalSpentMap.set(item.categoryId, item._sum.amount?.toNumber() || 0);
      });
    }

    const familyBudgetMap = new Map<string, Set<string>>();
    budgets.forEach((budget) => {
      if (!budget.familyId) return;
      const categorySet = familyBudgetMap.get(budget.familyId) || new Set<string>();
      categorySet.add(budget.categoryId);
      familyBudgetMap.set(budget.familyId, categorySet);
    });

    const familySpentMap = new Map<string, number>();
    for (const [familyId, categorySet] of familyBudgetMap.entries()) {
      const memberIds = familyUserMap.get(familyId) || [];
      const categoryIds = Array.from(categorySet);
      if (memberIds.length === 0 || categoryIds.length === 0) continue;

      const familyAggregates = await prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          categoryId: { in: categoryIds },
          type: "EXPENSE",
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          deletedAt: null,
          userId: { in: memberIds },
        },
        _sum: { amount: true },
      });

      familyAggregates.forEach((item) => {
        familySpentMap.set(`${familyId}:${item.categoryId}`, item._sum.amount?.toNumber() || 0);
      });
    }

    const progress = budgets.map((budget) => {
      const spent = budget.familyId
        ? familySpentMap.get(`${budget.familyId}:${budget.categoryId}`) || 0
        : personalSpentMap.get(budget.categoryId) || 0;
      const total = budget.amount;
      const percentage = total > 0 ? Math.min(Math.round((spent / total) * 100), 100) : 0;

      return {
        ...budget,
        spent,
        percentage,
        isOverBudget: spent > total,
      };
    });

    return progress.sort((a, b) => b.percentage - a.percentage);
  } catch (error) {
    console.error("Failed to get budget progress:", error);
    return [];
  }
}
