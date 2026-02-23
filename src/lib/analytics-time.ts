import { getAppDateParts } from "@/lib/app-time";

export interface MonthlyBucket {
  month: string;
  fullDate: string;
  value: number;
}

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

export function toYearMonthKey(year: number, month: number): string {
  return `${year}-${pad2(month)}`;
}

export function buildSixMonthBuckets(referenceDate: Date = new Date()): MonthlyBucket[] {
  const now = getAppDateParts(referenceDate);
  const currentAbsMonth = now.year * 12 + (now.month - 1);
  const buckets: MonthlyBucket[] = [];

  for (let i = 5; i >= 0; i--) {
    const abs = currentAbsMonth - i;
    const year = Math.floor(abs / 12);
    const month = (abs % 12) + 1;

    buckets.push({
      month: `${pad2(month)}/${year}`,
      fullDate: toYearMonthKey(year, month),
      value: 0,
    });
  }

  return buckets;
}
