import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { WorkspaceTopBar } from "@/components/layout/workspace-topbar";

interface WorkspaceLayoutProps {
  children: ReactNode;
  maxWidthClassName?: string;
  className?: string;
  contentClassName?: string;
  contentInnerClassName?: string;
  withPanel?: boolean;
  fullHeight?: boolean;
}

export function WorkspaceLayout({
  children,
  maxWidthClassName = "max-w-6xl",
  className,
  contentClassName,
  contentInnerClassName,
  withPanel = true,
  fullHeight = false,
}: WorkspaceLayoutProps) {
  return (
    <main
      className={cn(
        "relative min-h-screen px-4 py-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
      <div
        className={cn(
          "relative mx-auto flex flex-col gap-5",
          maxWidthClassName,
          fullHeight && "min-h-[calc(100vh-2rem)]"
        )}
      >
        <WorkspaceTopBar />

        <div
          className={cn(
            "flex-1 min-h-0",
            fullHeight && "lg:min-h-[calc(100vh-13.5rem)]",
            contentClassName
          )}
        >
          {withPanel ? (
            <section
              className={cn(
                "h-full rounded-2xl border border-border/70 bg-card/90 shadow-sm",
                contentInnerClassName
              )}
            >
              {children}
            </section>
          ) : (
            children
          )}
        </div>
      </div>
    </main>
  );
}
