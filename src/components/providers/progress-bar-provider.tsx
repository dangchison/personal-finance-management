"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  minimum: 0.3,
  easing: "ease",
  speed: 500,
});

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      if (target.href && !target.href.startsWith('#')) {
        NProgress.start();
      }
    };

    const handleMutation = () => {
      const anchors = document.querySelectorAll('a[href]');
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
        anchor.addEventListener('click', handleAnchorClick as EventListener);
      });
    };

    handleMutation();

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const anchors = document.querySelectorAll('a[href]');
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, []);

  return null;
}

export function ProgressBarProvider() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
