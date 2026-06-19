"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, ShieldAlert } from "lucide-react";
import type { Assessment as Ax } from "@/lib/types";
import { timeShort } from "@/lib/format";

export function GuidedFix({ ax, onBack, onDone }: { ax: Ax; onBack: () => void; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const step = ax.repairSteps[idx];
  const last = idx === ax.repairSteps.length - 1;

  return (
    <div className="relative h-full text-ink bg-paper flex flex-col">
      <div className="pt-12 pb-3 px-5 flex items-center justify-between">
        <button
          onClick={() => (idx === 0 ? onBack() : setIdx(idx - 1))}
          className="h-8 w-8 rounded-full border border-line flex items-center justify-center"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          step {idx + 1} / {ax.repairSteps.length}
        </div>
        <div className="h-8 w-8" />
      </div>

      <div className="px-5">
        <div className="flex gap-1.5">
          {ax.repairSteps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= idx ? "bg-coral" : "bg-line-strong"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-[40px] text-coral leading-none">
              {String(step.index).padStart(2, "0")}
            </div>
            <h1 className="font-display text-3xl leading-tight mt-3">{step.title}</h1>
            <p className="mt-4 text-[14px] text-ink-muted leading-relaxed">{step.description}</p>

            {step.toolsRequired.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">you'll need</div>
                <ul className="mt-2 space-y-1">
                  {step.toolsRequired.map((t) => (
                    <li key={t} className="text-[13px] flex items-center gap-2">
                      <span className="h-1 w-1 bg-coral rounded-full" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.safetyNote && (
              <div className="mt-5 rounded-2xl border border-coral/30 bg-coral/5 p-3 flex gap-2">
                <ShieldAlert size={14} className="text-coral shrink-0 mt-0.5" />
                <div className="text-[12px] text-ink leading-relaxed">{step.safetyNote}</div>
              </div>
            )}

            <div className="mt-5 inline-block font-mono text-[10px] text-ink-dim border border-line rounded-full px-2.5 py-1">
              ~{timeShort(step.estMinutes)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 pb-6 pt-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => (last ? onDone() : setIdx(idx + 1))}
          className="w-full rounded-full bg-coral text-paper font-medium py-3.5 flex items-center justify-center gap-2 glow-coral"
        >
          {last ? (
            <>
              <Check size={16} /> Done · show my report
            </>
          ) : (
            <>
              Next <ChevronRight size={16} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
