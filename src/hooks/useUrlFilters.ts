"use client";

import { useCallback, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";

/**
 * Custom hook for managing URL-based filter state
 * Handles URLSearchParams manipulation and navigation with transitions
 * 
 * @param basePath - The base path for navigation (e.g., "/dashboard", "/transactions")
 * @returns Object containing updateFilters, isPending, searchParams, and dateRange utilities
 */
export function useUrlFilters(basePath: string) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    /**
     * Update URL search params and trigger navigation
     * @param updates - Object with key-value pairs to update. 
     *                  Values of null, undefined, or "all" will remove the param
     */
    const updateFilters = useCallback((updates: Record<string, string | null | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        startTransition(() => {
            router.push(`${basePath}?${params.toString()}`);
        });
    }, [router, searchParams, basePath]);

    /**
   * Parse date range from URL params
   * Looks for "from" and "to" params and converts to Date objects
   */
    const dateRange = useMemo(() => {
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        if (!from && !to) return undefined;

        return {
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
        } as DateRange;
    }, [searchParams]);

    /**
     * Update date range in URL params
     * @param range - DateRange object or undefined to clear
     */
    const updateDateRange = useCallback((range: DateRange | { from?: Date; to?: Date } | undefined) => {
        if (!range || (!range.from && !range.to)) {
            updateFilters({ from: null, to: null });
        } else {
            updateFilters({
                from: range.from ? range.from.toISOString() : null,
                to: range.to ? range.to.toISOString() : null,
            });
        }
    }, [updateFilters]);

    return {
        updateFilters,
        updateDateRange,
        dateRange,
        isPending,
        searchParams,
    };
}
