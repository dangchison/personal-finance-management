import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Ngữ pháp panel của thế giới "Máy Dò Dòng Tiền":
 * khối vuông, viền hairline, không bóng đổ. Độ sâu đến từ viền và nền,
 * không đến từ shadow (Luật không bóng đổ, DESIGN.md).
 */
export function Panel({
  plaque,
  plaqueTone,
  className,
  children,
}: {
  /** Nhãn mono viết hoa đè lên viền trên — tấm biển chỉ danh của buồng máy. */
  plaque?: string;
  /** Màu chữ của plaque, mặc định là màu chữ dịu. */
  plaqueTone?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative border border-border bg-card",
        className,
        // pt-6 phải đứng SAU className: nơi gọi truyền `p-4` thì twMerge coi
        // p-4 là bản rộng hơn của pt-6 và nuốt mất, plaque đè lên nội dung.
        plaque && "pt-6"
      )}
    >
      {plaque && (
        <span
          className="pf-mono absolute -top-[9px] left-4 bg-background px-2 text-[11px] tracking-[0.16em] uppercase"
          style={plaqueTone ? { color: plaqueTone } : undefined}
        >
          {plaque}
        </span>
      )}
      {children}
    </section>
  );
}

/**
 * Lưới thép: kẻ bảng bằng khe hở 1px thay vì viền từng ô.
 * Đây là hình dạng dùng nhiều nhất của thế giới.
 */
export function SteelGrid({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid gap-px border border-border bg-border", className)}>
      {children}
    </div>
  );
}

/** Một ô đo trong lưới thép: nhãn mono nhỏ, số mono to. */
export function Readout({
  label,
  children,
  tone,
  wrap,
  className,
}: {
  label: string;
  children: ReactNode;
  /** Màu của số, lấy từ mã màu dữ liệu. Mặc định là màu chữ mạnh. */
  tone?: string;
  /** Cho giá trị xuống dòng. Số tiền thì không, nhưng chữ dài (email) thì cần. */
  wrap?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("bg-card p-3", wrap && "min-w-0", className)}>
      <p className="pf-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "pf-mono mt-1 text-[15px] font-semibold whitespace-nowrap sm:text-base",
          wrap && "break-words whitespace-normal"
        )}
        style={tone ? { color: tone } : undefined}
      >
        {children}
      </p>
    </div>
  );
}
