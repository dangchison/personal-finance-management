/**
 * Định dạng VND. Một hàm chuẩn duy nhất để mọi nơi ra cùng một chuỗi —
 * trước đây có ba lối (formatCurrency, formatCurrencyFull dùng NBSP, và nối
 * "₫" thủ công) cho ra chuỗi gần giống nhau nhưng khác ký tự khoảng trắng.
 */

/** Dấu trừ toán học U+2212, thẳng hàng với chữ số trong font tabular. */
export const MINUS = "−";

/** "1.000.000 ₫" */
export function formatCurrency(amount: number): string {
    return `${formatNumber(amount)} ₫`;
}

/** Giữ tên cũ cho 8 nơi đang gọi; nay là alias để không còn lệch NBSP. */
export function formatCurrencyFull(amount: number): string {
    return formatCurrency(amount);
}

/** Số không kèm ký hiệu tiền: "1.000.000" */
export function formatNumber(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount);
}

/**
 * Số tiền có dấu theo chiều tiền: "−45.000 ₫" / "+18.000.000 ₫".
 * Dùng U+2212 chứ không phải hyphen, để dấu trừ cùng bề rộng với dấu cộng.
 */
export function formatSignedCurrency(
    amount: number,
    type: "INCOME" | "EXPENSE"
): string {
    const sign = type === "INCOME" ? "+" : MINUS;
    return `${sign}${formatCurrency(Math.abs(amount))}`;
}
