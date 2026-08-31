/**
 * Màu biểu đồ lấy từ mã màu dữ liệu của thế giới (DESIGN.md §Colors).
 * Trả về chuỗi `var(--…)` chứ không phải hex: recharts truyền thẳng vào
 * thuộc tính SVG nên đổi nền sáng/tối là màu tự đúng, không cần useTheme().
 */

/** Vai cố định — mỗi màu một nghĩa, không được dùng lẫn. */
export const SERIES = {
    /** Chi tiêu: vệt dữ liệu có khối lượng. */
    expense: "var(--pf-expense)",
    /** Ngân sách / đường tham chiếu. */
    budget: "var(--pf-budget)",
    /** Vượt hạn mức. */
    over: "var(--pf-over)",
    /** Trạng thái ổn. */
    ok: "var(--pf-ok)",
    /** Thu nhập: đường mảnh trung tính, không fill — chỉ chi mới có khối lượng. */
    income: "var(--foreground)",
    /** Kỳ so sánh (năm ngoái, tháng trước). */
    compare: "var(--muted-foreground)",
} as const;

const CAT_STEPS = 8;

/**
 * Màu cho danh mục trong donut. Thế giới chỉ có 4 màu tín hiệu, mỗi màu một
 * nghĩa cố định, nên không thể lấy cyan/đỏ/xanh làm màu danh mục — một danh
 * mục ngẫu nhiên sẽ mang màu "vượt hạn mức". Thay vào đó dùng thang đơn sắc
 * "than nguội": tất cả đều là chi tiêu nên nằm trong họ vàng, đi từ vàng nóng
 * về thép nguội. Miếng nóng nhất là miếng tiêu nhiều nhất.
 *
 * @param index vị trí trong danh sách đã sắp giảm dần
 * @param total tổng số danh mục
 */
export function catColor(index: number, total: number): string {
    if (total <= 1) return "var(--pf-cat-1)";
    const step = Math.round((index / (total - 1)) * (CAT_STEPS - 1));
    return `var(--pf-cat-${Math.min(step, CAT_STEPS - 1) + 1})`;
}

/** Nét ngăn giữa hai miếng donut cùng bậc màu. */
export const SLICE_STROKE = "var(--background)";
