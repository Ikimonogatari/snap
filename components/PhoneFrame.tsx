"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

export function PhoneFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="relative">
      {label && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-canvas border border-line-strong text-[10px] uppercase tracking-[0.18em] text-ink-muted font-mono">
          {label}
        </div>
      )}
      <motion.div
        initial={{ y: 24, opacity: 0, rotateX: 12 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
        className="relative mx-auto"
        style={{ width: 340 }}
      >
        <div
          className="relative rounded-[44px] p-[10px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
          style={{
            height: 700,
            background: "linear-gradient(to bottom, #1a1a1f, #0a0a0b)",
          }}
        >
          <div className="relative h-full w-full rounded-[36px] overflow-hidden bg-[#0a0a0b]">
            <div className="phone-notch" />
            <div className="phone-scroll absolute inset-0 overflow-y-auto">{children}</div>
          </div>
        </div>
        <div className="absolute -right-[3px] top-32 h-20 w-[3px] rounded-r-full bg-[#2a2a30]" />
        <div className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l-full bg-[#2a2a30]" />
        <div className="absolute -left-[3px] top-44 h-16 w-[3px] rounded-l-full bg-[#2a2a30]" />
      </motion.div>
    </div>
  );
}
