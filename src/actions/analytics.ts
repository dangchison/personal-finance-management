"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { eachDayOfInterval, format } from "date-fns";

export async function getDailyStats(
  startDate?: Date,
  endDate?: Date,
  scope: "personal" | "family" = "personal"
) {
  try {
    const user = await getAuthenticatedUser();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { familyId: true }
    });

    const now = new Date();
    // Default to last 30 days
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const end = endDate || now;
    end.setHours(23, 59, 59, 999);

    const where: any = {
      date: {
        gte: start,
        lte: end
      },
      deletedAt: null
    };

    if (scope === "family" && dbUser?.familyId) {
      const familyUsers = await prisma.user.findMany({
        where: { familyId: dbUser.familyId },
        select: { id: true }
      });
      where.userId = { in: familyUsers.map(u => u.id) };
    } else {
      where.userId = user.id;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    // Aggregate by day
    const statsMap = new Map<string, { income: number; expense: number }>();

    // Initialize all days
    const days = eachDayOfInterval({ start, end });
    days.forEach(day => {
      statsMap.set(format(day, 'yyyy-MM-dd'), { income: 0, expense: 0 });
    });

    transactions.forEach(t => {
      const key = format(t.date, 'yyyy-MM-dd');
      const current = statsMap.get(key) || { income: 0, expense: 0 };
      if (t.type === "INCOME") {
        current.income += t.amount.toNumber();
      } else {
        current.expense += t.amount.toNumber();
      }
      statsMap.set(key, current);
    });

    return Array.from(statsMap.entries()).map(([date, values]) => ({
      date,
      ...values
    }));

  } catch (error) {
    console.error("Failed to fetch daily stats:", error);
    return [];
  }
}

export async function getCategoryStats(
  startDate?: Date,
  endDate?: Date,
  scope: "personal" | "family" = "personal"
) {
  try {
    const user = await getAuthenticatedUser();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { familyId: true }
    });

    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1); // Default current month
    const end = endDate || now;

    const where: any = {
      date: {
        gte: start,
        lte: end
      },
      type: "EXPENSE", // Focus on expense
      deletedAt: null
    };

    if (scope === "family" && dbUser?.familyId) {
      const familyUsers = await prisma.user.findMany({
        where: { familyId: dbUser.familyId },
        select: { id: true }
      });
      where.userId = { in: familyUsers.map(u => u.id) };
    } else {
      where.userId = user.id;
    }

    const aggregated = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where,
      _sum: {
        amount: true
      }
    });

    // Need category names
    const categoryIds = aggregated.map(a => a.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true }
    });

    return aggregated.map(a => {
      const cat = categories.find(c => c.id === a.categoryId);
      return {
        name: cat?.name || "Unknown",
        value: a._sum.amount?.toNumber() || 0
      };
    }).sort((a, b) => b.value - a.value);

  } catch (error) {
    console.error("Failed to fetch category stats:", error);
    return [];
  }
}

export async function getYearlyComparison(
  scope: "personal" | "family" = "personal"
) {
  try {
    const user = await getAuthenticatedUser();
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { familyId: true }
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    // Define filter based on scope
    const where: any = {
      type: "EXPENSE",
      deletedAt: null
    };

    if (scope === "family" && dbUser?.familyId) {
      const familyUsers = await prisma.user.findMany({
        where: { familyId: dbUser.familyId },
        select: { id: true }
      });
      where.userId = { in: familyUsers.map(u => u.id) };
    } else {
      where.userId = user.id;
    }

    // Fetch transactions for both years
    const transactions = await prisma.transaction.findMany({
      where: {
        ...where,
        date: {
          gte: new Date(lastYear, 0, 1), // Jan 1st last year
          lte: new Date(currentYear, 11, 31, 23, 59, 59) // Dec 31st current year
        }
      },
      select: {
        date: true,
        amount: true
      }
    });

    // Initialize result array [0..11]
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      name: `T${i + 1}`,
      currentYear: 0,
      lastYear: 0,
    }));

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const year = tDate.getFullYear();
      const monthIndex = tDate.getMonth(); // 0-11

      if (year === currentYear) {
        monthlyData[monthIndex].currentYear += Number(t.amount);
      } else if (year === lastYear) {
        monthlyData[monthIndex].lastYear += Number(t.amount);
      }
    });

    return monthlyData;

  } catch (error) {
    console.error("Failed to fetch yearly stats:", error);
    return [];
  }
}
