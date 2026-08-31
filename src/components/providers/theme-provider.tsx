"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

/**
 * Script đặt class theme TRƯỚC khi trang vẽ, để không nháy nền sáng rồi mới tối.
 * Chạy ở <head> chứ không phải trong cây React của <body>: next-themes render
 * script này như một element anh em trong body, và nó làm lệch bộ đếm useId của
 * React — mọi component Radix sau đó (Dropdown, Dialog, Select) sinh id khác
 * nhau giữa server và client, gây hydration mismatch trên mọi trang của app.
 */
export const THEME_BOOTSTRAP = `(function(){try{
var s=localStorage.getItem('theme');
var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
var r=document.documentElement;
r.classList.toggle('dark',t==='dark');
r.style.colorScheme=t;
}catch(e){}})();`;

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ theme: "dark", setTheme: () => {} });

/**
 * Chỉ cung cấp context, không render thêm bất kỳ element nào — đó là điều kiện
 * để cây server và cây client giống hệt nhau.
 */
/** Nguồn sự thật là class trên <html>, do script bootstrap đặt trước khi vẽ. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Server chưa biết theme; trả mặc định để hydrate khớp, class thật đã có sẵn. */
function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Trình duyệt chặn storage thì vẫn đổi được theme cho phiên hiện tại
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
