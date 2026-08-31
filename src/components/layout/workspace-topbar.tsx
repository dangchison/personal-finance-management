"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, Settings, Users, Wallet } from "lucide-react";
import { UserNav } from "@/components/auth/user-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { RingMark } from "@/components/brand/ring-mark";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/transactions", label: "Lịch sử", icon: Wallet },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
  { href: "/family", label: "Gia đình", icon: Users },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name?.trim();

  return (
    <header className="relative z-30 shrink-0 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 xl:px-14">
        <Link href="/dashboard" className="flex min-h-11 items-center gap-2.5">
          <RingMark className="h-7 w-7 shrink-0" />
          <span className="pf-display hidden text-sm font-semibold tracking-[0.12em] whitespace-nowrap text-foreground min-[380px]:inline">
            PERSONAL FINANCE
          </span>
        </Link>

        <nav className="hidden items-center lg:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "pf-mono relative flex h-14 items-center px-4 text-[11px] tracking-[0.14em] uppercase transition-colors",
                  active
                    ? "text-(--pf-expense-ink)"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 bg-(--pf-expense)" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          {userName && (
            <span className="pf-mono mr-1 hidden text-[11px] tracking-[0.1em] text-muted-foreground uppercase xl:inline">
              {userName}
            </span>
          )}
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
