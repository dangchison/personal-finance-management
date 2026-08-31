"use client";

import { useEffect } from "react";
import { RingMark } from "@/components/brand/ring-mark";

interface GoodbyeScreenProps {
  userName?: string | null;
  onComplete: () => void;
}

/**
 * Đây là loading state thật, không phải hiệu ứng: signOut() là async và chậm,
 * màn này che khoảng chờ đó. Vì vậy giữ lại, chỉ bỏ phần trang trí.
 */
export function GoodbyeScreen({ userName, onComplete }: GoodbyeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 900);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background">
      <RingMark className="h-14 w-14 animate-pulse" />
      <div className="space-y-2 text-center">
        <p className="pf-display text-xl font-bold text-foreground">
          Tạm biệt{userName ? `, ${userName}` : ""}!
        </p>
        <p className="text-sm text-muted-foreground">Hẹn gặp lại bạn sớm nhé</p>
      </div>
      <p className="pf-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        Đang đóng sổ…
      </p>
    </div>
  );
}
