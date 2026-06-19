"use client";

import { motion } from "motion/react";
import { ChevronRight, MapPin, AlertTriangle } from "lucide-react";
import type { Case } from "@/lib/types";

const sev = {
  critical: "bg-coral",
  high: "bg-coral/80",
  medium: "bg-mint",
  low: "bg-ink-dim",
};

export function CaseList({ cases, onPick }: { cases: Case[]; onPick: (id: string) => void }) {
  return (
    <div className="text-ink bg-paper h-full">
      <div className="px-5 pt-12 pb-4 border-b border-line">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">today</div>
            <h1 className="font-display text-[34px] mt-1 leading-[1.05]">
              What did you<br />
              <em className="text-coral">snap?</em>
            </h1>
          </div>
          <div className="relative h-10 w-10 rounded-full bg-coral/15 ring-1 ring-coral/30 flex items-center justify-center font-mono text-sm">
            T
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          recent snaps · {cases.length}
        </div>
      </div>

      <ul className="px-5 space-y-3 pb-8">
        {cases.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onPick(c.id)}
            className="relative rounded-2xl bg-warm/40 border border-line p-4 active:scale-[0.98] transition-transform cursor-pointer overflow-hidden"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${sev[c.severity]}`} />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-ink-dim uppercase tracking-[0.18em]">
                    {c.caseCode}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-paper border border-line text-[9px] font-mono uppercase text-ink-muted">
                    {c.assetType}
                  </span>
                  {c.severity === "critical" && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-coral/15 text-coral text-[9px] font-mono uppercase">
                      <AlertTriangle size={9} /> urgent
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[15px] font-medium leading-snug">{c.asset}</div>
                <div className="mt-1.5 text-xs text-ink-muted flex items-center gap-1.5 truncate">
                  <MapPin size={11} className="shrink-0" />
                  {c.customer}
                </div>
              </div>
              <ChevronRight size={18} className="text-ink-dim mt-1" />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
