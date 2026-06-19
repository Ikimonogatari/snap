"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const stages = [
  "Looking at your photo",
  "Identifying the item",
  "Spotting the damage",
  "Checking fair value",
  "Writing your report",
];

export function Analyzing({ done }: { done: boolean }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (done) {
      setActive(stages.length);
      return;
    }
    const id = setInterval(() => setActive((a) => Math.min(a + 1, stages.length - 1)), 700);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div className="relative h-full bg-paper overflow-hidden text-ink">
      <div className="absolute left-1/2 top-40 -translate-x-1/2">
        <div className="relative h-44 w-44">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-coral/30 border-t-coral"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border border-coral/10 border-b-coral/60"
          />
          <div className="absolute inset-10 rounded-full border border-line bg-warm/40 scan-sweep overflow-hidden flex items-center justify-center font-display text-4xl">
            <span className="text-coral relative z-10">AI</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-12 px-5 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-ink-dim">snap · thinking</div>
        <h1 className="font-display text-3xl mt-2">
          <em className="not-italic">Almost there</em>.
        </h1>
      </div>

      <div className="absolute inset-x-0 bottom-12 px-6">
        <ul className="space-y-2.5">
          {stages.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= active ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 text-sm"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${i < active ? "bg-coral" : i === active ? "bg-coral animate-pulse" : "bg-line-strong"}`} />
              <span className={`font-mono text-[12px] ${i <= active ? "text-ink" : "text-ink-dim"}`}>{s}</span>
              {i === active && !done && <span className="caret text-coral">_</span>}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
