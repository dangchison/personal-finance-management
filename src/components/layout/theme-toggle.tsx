"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

/**
 * Markup không phụ thuộc theme: render cả hai icon, CSS chọn cái hiện theo
 * class `dark` trên <html>. Chọn icon bằng JS sẽ làm server và client render
 * khác nhau ở lần đầu.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 rounded-sm sm:size-10"
      aria-label="Đổi nền sáng / tối"
      title="Đổi nền sáng / tối"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}
