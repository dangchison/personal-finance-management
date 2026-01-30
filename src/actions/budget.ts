"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { Budget, Category } from "@prisma/client";

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
    const whereClause: any = {
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
        } as any
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
    }) as any;

    return budgets.map((b: any) => ({
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

    const progress = await Promise.all(budgets.map(async (budget) => {
      const where: any = {
        categoryId: budget.categoryId,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        deletedAt: null
      };

      if (budget.familyId) {
        const familyUsers = await prisma.user.findMany({
          where: { familyId: budget.familyId },
          select: { id: true }
        });
        where.userId = { in: familyUsers.map(u => u.id) };
      } else {
        where.userId = user.id;
      }

      const aggregate = await prisma.transaction.aggregate({
        where,
        _sum: { amount: true }
      });

      const spent = aggregate._sum.amount?.toNumber() || 0;
      const total = budget.amount;

      return {
        ...budget,
        spent,
        percentage: Math.min(Math.round((spent / total) * 100), 100),
        isOverBudget: spent > total
      };
    }));

    return progress.sort((a, b) => b.percentage - a.percentage);
  } catch (error) {
    console.error("Failed to get budget progress:", error);
    return [];
  }
}
