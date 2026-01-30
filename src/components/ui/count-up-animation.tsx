"use client";

import { useEffect, useState } from "react";

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  formatNumber?: (num: number) => string;
}

export function CountUpAnimation({ end, duration = 1500, formatNumber }: CountUpAnimationProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentCount = Math.floor(easeProgress * (end - startValue) + startValue);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  if (formatNumber) {
    return <>{formatNumber(count)}</>;
  }

  return <>{new Intl.NumberFormat("vi-VN").format(count)}</>;
}
