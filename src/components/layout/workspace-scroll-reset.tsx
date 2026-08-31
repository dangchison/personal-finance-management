"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Window không còn là scroll container nên App Router không tự đưa trang về
 * đầu khi đổi route. Đây là phần bù cho quyết định đó.
 */
export function WorkspaceScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.getElementById("pf-scroll")?.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}
