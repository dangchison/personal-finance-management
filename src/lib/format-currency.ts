/**
 * Currency formatting utilities for Vietnamese Dong (VND)
 */

/**
 * Format amount as currency with VND symbol
 * @param amount - Number to format
 * @returns Formatted string like "1.000.000 ₫"
 */
export function formatCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat("vi-VN").format(amount);
    return `${formatted} ₫`;
}

/**
 * Format amount as full currency using Intl standards
 * @param amount - Number to format
 * @returns Formatted string like "1.000.000 ₫" (Intl standard)
 */
export function formatCurrencyFull(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

/**
 * Format amount without currency symbol
 * @param amount - Number to format
 * @returns Formatted string like "1.000.000"
 */
export function formatNumber(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount);
}
