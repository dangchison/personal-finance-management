"use client"

import type { CSSProperties } from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isDark = theme === "dark"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={false}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={{
        "--normal-bg": isDark ? "#1f2937" : "#ffffff",
        "--normal-border": isDark ? "#374151" : "#e5e7eb",
        "--normal-text": isDark ? "#f9fafb" : "#111827",
        "--success-bg": isDark ? "#052e16" : "#ecfdf3",
        "--success-border": isDark ? "#166534" : "#bbf7d0",
        "--success-text": isDark ? "#dcfce7" : "#166534",
        "--error-bg": isDark ? "#450a0a" : "#fef2f2",
        "--error-border": isDark ? "#991b1b" : "#fecaca",
        "--error-text": isDark ? "#fee2e2" : "#991b1b",
        "--warning-bg": isDark ? "#422006" : "#fffbeb",
        "--warning-border": isDark ? "#92400e" : "#fde68a",
        "--warning-text": isDark ? "#fef3c7" : "#92400e",
        "--info-bg": isDark ? "#172554" : "#eff6ff",
        "--info-border": isDark ? "#1d4ed8" : "#bfdbfe",
        "--info-text": isDark ? "#dbeafe" : "#1d4ed8",
      } as CSSProperties}
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border shadow-lg p-4 gap-3",
          title: "text-base font-semibold",
          description: "text-sm opacity-90",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
