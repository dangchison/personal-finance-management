"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, Wallet } from "lucide-react";
import { UserNav } from "@/components/auth/user-nav";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Lịch sử", icon: Wallet },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name?.trim();

  return (
    <header className="rounded-2xl border border-border/70 bg-card/90 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{userName || "Workspace"}</p>
            <p className="text-sm font-semibold tracking-tight text-foreground">Personal Finance</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <UserNav />
      </div>

      <nav className="grid grid-cols-3 gap-2 border-t border-border/60 px-3 py-2 lg:hidden">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center justify-center rounded-lg border px-2 py-2 text-sm",
                active
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-border/70 bg-background text-muted-foreground"
              )}
            >
              <item.icon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
