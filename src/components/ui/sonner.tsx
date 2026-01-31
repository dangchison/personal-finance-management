"use client"

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
        "--normal-bg": "rgba(255, 255, 255, 0.1)",
        "--normal-border": "rgba(255, 255, 255, 0.2)",
        "--normal-text": "#ffffff",
        "--success-bg": "rgba(34, 197, 94, 0.2)",
        "--success-border": "rgba(74, 222, 128, 0.3)",
        "--success-text": "#ffffff",
        "--error-bg": "rgba(239, 68, 68, 0.2)",
        "--error-border": "rgba(248, 113, 113, 0.3)",
        "--error-text": "#ffffff",
        "--warning-bg": "rgba(234, 179, 8, 0.2)",
        "--warning-border": "rgba(250, 204, 21, 0.3)",
        "--warning-text": "#ffffff",
        "--info-bg": "rgba(59, 130, 246, 0.2)",
        "--info-border": "rgba(96, 165, 250, 0.3)",
        "--info-text": "#ffffff",
      } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: "backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-4 gap-3",
          title: "!text-white text-base font-semibold",
          description: "!text-white/90 text-sm",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
