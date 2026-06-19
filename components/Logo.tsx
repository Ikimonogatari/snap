"use client";

import { motion } from "motion/react";

export function LogoMark({ size = 30, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Snap mark"
    >
      <rect x="2" y="2" width="32" height="32" rx="10" fill="var(--color-navy)" />
      <motion.path
        d="M18 8 L23 17 L13 17 Z"
        fill="var(--color-coral)"
        initial={animated ? { opacity: 0, y: -4 } : undefined}
        animate={animated ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M9 22 L19 22 L14 13 Z"
        fill="var(--color-coral)"
        opacity="0.85"
        initial={animated ? { opacity: 0, x: -4 } : undefined}
        animate={animated ? { opacity: 0.85, x: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M27 22 L17 22 L22 13 Z"
        fill="var(--color-coral)"
        opacity="0.6"
        initial={animated ? { opacity: 0, x: 4 } : undefined}
        animate={animated ? { opacity: 0.6, x: 0 } : undefined}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={18}
        cy={19}
        r={2.4}
        fill="var(--color-cream)"
        initial={animated ? { scale: 0 } : undefined}
        animate={animated ? { scale: 1 } : undefined}
        transition={{ duration: 0.4, delay: 0.4, ease: "backOut" }}
      />
    </svg>
  );
}

export function Logo({
  size = 30,
  showWordmark = true,
}: {
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 text-ink">
      <LogoMark size={size} />
      {showWordmark && (
        <span
          className="font-display tracking-tight leading-none"
          style={{ fontSize: size * 1.05 }}
        >
          Snap<span className="text-coral">.</span>
        </span>
      )}
    </div>
  );
}
