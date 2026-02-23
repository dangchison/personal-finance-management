"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { getScopeUserIds } from "@/lib/scope-users";
import { buildSixMonthBuckets, toYearMonthKey } from "@/lib/analytics-time";
import {
  createAppDate,
  formatAppDateParam,
  getAppDateParts,
  getAppMonthRange,
  toAppEndOfDay,
  toAppStartOfDay,
} from "@/lib/app-time";
import { eachDayOfInterval } from "date-fns";
import { Prisma } from "@prisma/client";

export async function getDailyStats(
  startDate?: Date,
  endDate?: Date,
  scope: "personal" | "family" = "personal"
) {
  try {
    const user = await getAuthenticatedUser();
    const userIds = await getScopeUserIds(user.id, scope);

    const now = new Date();
    const end = toAppEndOfDay(endDate || now);
    const start = toAppStartOfDay(
      startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
    );

    const where: Prisma.TransactionWhereInput = {
      date: {
        gte: start,
        lte: end,
      },
      deletedAt: null,
      userId: { in: userIds },
    };

    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    // Aggregate by day
    const statsMap = new Map<string, { income: number; expense: number }>();

    // Initialize all days
    const days = eachDayOfInterval({ start, end });
    days.forEach((day) => {
      statsMap.set(formatAppDateParam(day), { income: 0, expense: 0 });
    });

    transactions.forEach((t) => {
      const key = formatAppDateParam(t.date);
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
      ...values,
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
    const userIds = await getScopeUserIds(user.id, scope);

    const defaultMonth = getAppMonthRange();
    const start = startDate ? toAppStartOfDay(startDate) : defaultMonth.start;
    const end = endDate ? toAppEndOfDay(endDate) : defaultMonth.end;

    const where: Prisma.TransactionWhereInput = {
      date: {
        gte: start,
        lte: end,
      },
      type: "EXPENSE", // Focus on expense
      deletedAt: null,
      userId: { in: userIds },
    };

    const aggregated = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where,
      _sum: {
        amount: true,
      },
    });

    // Need category names
    const categoryIds = aggregated.map((a) => a.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    return aggregated
      .map((a) => ({
        name: categoryMap.get(a.categoryId) || "Unknown",
        value: a._sum.amount?.toNumber() || 0,
      }))
      .sort((a, b) => b.value - a.value);
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
    const userIds = await getScopeUserIds(user.id, scope);

    const nowParts = getAppDateParts(new Date());
    const currentYear = nowParts.year;
    const lastYear = currentYear - 1;

    // Fetch transactions for both years
    const transactions = await prisma.transaction.findMany({
      where: {
        type: "EXPENSE",
        deletedAt: null,
        userId: { in: userIds },
        date: {
          gte: createAppDate(lastYear, 1, 1, 0, 0, 0, 0),
          lte: createAppDate(currentYear, 12, 31, 23, 59, 59, 999),
        },
      },
      select: {
        date: true,
        amount: true,
      },
    });

    // Initialize result array [0..11]
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      name: `T${i + 1}`,
      currentYear: 0,
      lastYear: 0,
    }));

    transactions.forEach((t) => {
      const parts = getAppDateParts(t.date);
      const year = parts.year;
      const monthIndex = parts.month - 1; // 0-11

      if (year === currentYear) {
        monthlyData[monthIndex].currentYear += t.amount.toNumber();
      } else if (year === lastYear) {
        monthlyData[monthIndex].lastYear += t.amount.toNumber();
      }
    });

    return monthlyData;
  } catch (error) {
    console.error("Failed to fetch yearly stats:", error);
    return [];
  }
}

export async function getSixMonthTrend(
  scope: "personal" | "family" = "personal"
) {
  try {
    const user = await getAuthenticatedUser();
    const userIds = await getScopeUserIds(user.id, scope);

    const monthlyData = buildSixMonthBuckets(new Date());

    const oldest = monthlyData[0];
    const [oldestYear, oldestMonth] = oldest.fullDate.split("-").map(Number);
    const startDate = createAppDate(oldestYear, oldestMonth, 1, 0, 0, 0, 0);
    const endDate = toAppEndOfDay(new Date());

    const transactions = await prisma.transaction.findMany({
      where: {
        type: "EXPENSE",
        deletedAt: null,
        userId: { in: userIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        amount: true,
      },
    });

    const bucketIndexByKey = new Map(monthlyData.map((item, index) => [item.fullDate, index]));
    transactions.forEach((t) => {
      const parts = getAppDateParts(t.date);
      const key = toYearMonthKey(parts.year, parts.month);
      const index = bucketIndexByKey.get(key);
      if (index === undefined) return;
      monthlyData[index].value += t.amount.toNumber();
    });

    return monthlyData;
  } catch (error) {
    console.error("Failed to fetch 6-month trend:", error);
    return [];
  }
}

export async function getMonthlySummary(
  startDate?: Date,
  endDate?: Date,
  scope: "personal" | "family" = "personal"
) {
  try {
    const user = await getAuthenticatedUser();
    const userIds = await getScopeUserIds(user.id, scope);
    const defaultMonth = getAppMonthRange();
    const start = startDate ? toAppStartOfDay(startDate) : defaultMonth.start;
    const end = endDate ? toAppEndOfDay(endDate) : defaultMonth.end;

    const where: Prisma.TransactionWhereInput = {
      date: {
        gte: start,
        lte: end,
      },
      deletedAt: null,
      userId: { in: userIds },
    };

    const aggregated = await prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: {
        amount: true,
      },
    });

    const income = aggregated.find((a) => a.type === "INCOME")?._sum.amount?.toNumber() || 0;
    const expense = aggregated.find((a) => a.type === "EXPENSE")?._sum.amount?.toNumber() || 0;

    return { income, expense };
  } catch (error) {
    console.error("Failed to fetch monthly summary:", error);
    return { income: 0, expense: 0 };
  }
}
