/**
 * Công thức tab vuông + gạch chân vàng, dùng chung ba màn: Lịch sử, Báo cáo, Cài đặt.
 *
 * Hai mẩu trong chuỗi này trông thừa nhưng không bỏ được:
 *
 * 1. `group-data-[orientation=horizontal]/tabs:h-auto` là cách duy nhất huỷ `h-9` mà
 *    tabsListVariants đặt lên TabsList. Một `h-auto` trần không thắng — Tailwind biên
 *    dịch biến thể group thành `:is(:where(.group\/tabs)[data-orientation="…"] *)`,
 *    đặc trưng (0,2,0) so với (0,1,0) của `.h-auto`, và twMerge cũng giữ cả hai vì
 *    khác modifier. Thiếu nó thì trigger 44px bị nhét trong khung 36px: tab bị cắt,
 *    mọc thanh cuộn dọc, gạch chân vàng biến mất.
 *
 * 2. `group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none` gỡ
 *    `shadow-sm` mà TabsTrigger tự phát cho tab đang mở khi TabsList chạy nhánh
 *    variant mặc định (Luật không bóng đổ).
 *
 * Nơi gọi nối thêm class bố cục (`w-full`, `grid grid-cols-2`, `sm:w-[400px]`…).
 */
export const TAB_LIST =
    "group-data-[orientation=horizontal]/tabs:h-auto rounded-none border border-border bg-transparent p-0";

/** min-h-11 cho ngưỡng chạm 44px trên mobile, hạ về 36px từ sm trở lên. */
export const TAB_TRIGGER =
    "pf-mono min-h-11 rounded-none px-4 text-[11px] tracking-[0.1em] uppercase group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-(--pf-expense) data-[state=active]:bg-transparent data-[state=active]:text-(--pf-expense-ink) sm:min-h-9 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-(--pf-expense-ink)";
