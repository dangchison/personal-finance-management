/**
 * Chất liệu trục và tooltip dùng chung cho mọi chart recharts.
 * Trước đây ba file chart tự khai ba bản giống hệt nhau và ba cách rút gọn số
 * khác nhau ("60.0M", "60tr", "60k") — trên xl hai chart nằm cạnh nhau nên
 * người dùng thấy hai đơn vị cho cùng một đại lượng.
 */

export const AXIS_TICK = {
    fontFamily: "var(--font-pf-mono)",
    fontSize: 11,
    fill: "var(--muted-foreground)",
} as const;

export const TOOLTIP_STYLE = {
    borderRadius: 0,
    border: "1px solid var(--border)",
    background: "var(--popover)",
    color: "var(--popover-foreground)",
    boxShadow: "none",
    fontFamily: "var(--font-pf-mono)",
    fontSize: 12,
} as const;

/** Nhãn tiền rút gọn trên trục: "1,2tr" / "450k" / "0". Đơn vị tiếng Việt. */
export function axisMoney(value: number): string {
    if (!value) return "0";
    if (Math.abs(value) >= 1_000_000) {
        const millions = value / 1_000_000;
        // Bỏ ".0" thừa: 60tr đọc nhanh hơn 60,0tr, nhưng 1,2tr thì cần một chữ số.
        const text = Number.isInteger(millions) ? String(millions) : millions.toFixed(1);
        return `${text.replace(".", ",")}tr`;
    }
    return `${Math.round(value / 1000)}k`;
}
