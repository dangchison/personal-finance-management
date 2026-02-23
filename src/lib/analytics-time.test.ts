import { describe, expect, it } from "vitest";
import { createAppDate } from "@/lib/app-time";
import { buildSixMonthBuckets, toYearMonthKey } from "@/lib/analytics-time";

describe("analytics-time", () => {
  it("builds exactly 6 rolling month buckets across year boundaries", () => {
    const reference = createAppDate(2026, 2, 23, 12, 0, 0, 0);
    const buckets = buildSixMonthBuckets(reference);

    expect(buckets).toHaveLength(6);
    expect(buckets.map((b) => b.fullDate)).toEqual([
      "2025-09",
      "2025-10",
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
    ]);
    expect(buckets[0].month).toBe("09/2025");
    expect(buckets[5].month).toBe("02/2026");
    expect(buckets.every((b) => b.value === 0)).toBe(true);
  });

  it("formats year-month keys with zero-padded month", () => {
    expect(toYearMonthKey(2026, 2)).toBe("2026-02");
    expect(toYearMonthKey(2026, 11)).toBe("2026-11");
  });
});
