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
  delay = 0,
  format = "plain",
  trigger = "view",
  className = "",
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  delay?: number;
  format?: "plain" | "comma";
  trigger?: "mount" | "view";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const [val, setVal] = useState(from);

  useEffect(() => {
    const shouldRun = trigger === "mount" || inView;
    if (!shouldRun) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration, delay, trigger]);

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
