"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

export function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  format = "plain",
  className = "",
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  format?: "plain" | "comma";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  const text =
    format === "comma"
      ? val.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : val.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
