"use client";

import { motion } from "motion/react";
import { ArrowLeft, ShieldAlert, Wrench, Clock, BadgeDollarSign, Sparkles, MapPin, Phone, Star, Receipt, Scale } from "lucide-react";
import type { Assessment as Ax } from "@/lib/types";
import { pct, timeShort, money } from "@/lib/format";

const sevTextColor: Record<string, string> = {
  critical: "text-coral",
  high: "text-coral",
  medium: "text-ink",
  low: "text-ink-muted",
};

const verdictMap = {
  repair: { label: "Fixable", color: "text-mint border-mint/40 bg-mint/10" },
  replace: { label: "Replace", color: "text-coral border-coral/40 bg-coral/10" },
  total_loss: { label: "Not worth it", color: "text-ink border-line-strong bg-warm/40" },
} as const;

export function Assessment({ ax, onBack, onStart }: { ax: Ax; onBack: () => void; onStart: () => void }) {
  const verdict = verdictMap[ax.verdict.decision];
  return (
    <div className="text-ink bg-paper h-full pb-32 overflow-hidden">
      <div className="pt-12 pb-3 px-5 flex items-center justify-between">
        <button onClick={onBack} className="h-8 w-8 rounded-full border border-line flex items-center justify-center">
          <ArrowLeft size={14} />
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">your snap</div>
        <div className="h-8 w-8" />
      </div>

      <div className="px-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">we see</div>
          <h1 className="font-display text-3xl leading-tight mt-1">{ax.detectedAsset}</h1>
          <div className="mt-1 font-mono text-[11px] text-coral flex items-center gap-1.5">
            <Sparkles size={11} /> {pct(ax.confidence)} confident
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className={`mt-5 rounded-2xl border p-4 ${verdict.color}`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
            <BadgeDollarSign size={11} /> the call
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="font-display text-4xl leading-none">
              <em className="not-italic">{verdict.label}.</em>
            </div>
            <div className="font-mono text-base">
              {money(ax.verdict.estimatedCost.amount, ax.verdict.estimatedCost.currency)}
            </div>
          </div>
          <div className="mt-2 text-[12px] leading-relaxed">{ax.verdict.reason}</div>
          {ax.verdict.estimatedTimeMinutes > 0 && (
            <div className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">
              <span className="inline-flex items-center gap-1"><Clock size={10} /> {timeShort(ax.verdict.estimatedTimeMinutes)}</span>
              <span className="inline-flex items-center gap-1"><Wrench size={10} /> {ax.repairSteps.length} steps</span>
            </div>
          )}
        </motion.div>

        <div className="mt-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim mb-2">what we found</div>
          <ul className="space-y-2">
            {ax.damages.slice(0, 4).map((d, i) => (
              <motion.li
                key={d.type}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="rounded-2xl border border-line bg-warm/30 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[14px] font-medium leading-snug">{d.type}</div>
                  <div className={`font-mono text-[10px] uppercase ${sevTextColor[d.severity]}`}>{d.severity}</div>
                </div>
                <div className="mt-0.5 font-mono text-[10px] text-ink-dim">{d.location}</div>
                <div className="mt-1.5 text-[11px] text-ink-muted leading-relaxed">{d.evidence}</div>
              </motion.li>
            ))}
          </ul>
        </div>

        {ax.pricingBreakdown && ax.pricingBreakdown.length > 0 && (
          <div className="mt-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim mb-2 flex items-center gap-1.5">
              <Receipt size={11} className="text-coral" /> how the price breaks down
            </div>
            <div className="rounded-2xl border border-line bg-warm/30 overflow-hidden">
              {ax.pricingBreakdown.map((row, i) => (
                <div
                  key={`${row.label}-${i}`}
                  className="px-3 py-2.5 border-b border-line last:border-b-0 flex items-baseline justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[12.5px] truncate">{row.label}</div>
                    {row.note && <div className="text-[10px] text-ink-dim mt-0.5 truncate">{row.note}</div>}
                  </div>
                  <div className="font-mono text-[12px] text-ink whitespace-nowrap">
                    {row.amount === 0 ? "—" : money(row.amount, row.currency)}
                  </div>
                </div>
              ))}
              <div className="px-3 py-2.5 bg-coral/10 border-t border-coral/30 flex items-baseline justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">total</div>
                <div className="font-mono text-[13px] text-coral">
                  {money(ax.verdict.estimatedCost.amount, ax.verdict.estimatedCost.currency)}
                </div>
              </div>
            </div>
          </div>
        )}

        {ax.marketComparison && (
          <div className="mt-4 rounded-2xl border border-line bg-warm/20 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">
              <Scale size={11} className="text-coral" /> how this compares to replacement
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">repair</div>
                <div className="text-mint font-medium">
                  {money(ax.verdict.estimatedCost.amount, ax.verdict.estimatedCost.currency)}
                </div>
              </div>
              {ax.marketComparison.replacementCost && (
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-dim">replacement</div>
                  <div className="text-ink-muted line-through">
                    {money(ax.marketComparison.replacementCost, ax.marketComparison.currency)}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] text-ink-muted leading-relaxed">{ax.marketComparison.source}</p>
          </div>
        )}

        {ax.fixLocations && ax.fixLocations.length > 0 && (
          <div className="mt-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim mb-2 flex items-center gap-1.5">
              <MapPin size={11} className="text-coral" /> where to get it fixed
            </div>
            <ul className="space-y-2">
              {ax.fixLocations.map((loc) => (
                <li key={loc.name} className="rounded-2xl border border-line bg-warm/30 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium">{loc.name}</div>
                      <div className="mt-0.5 text-[11px] text-ink-muted leading-snug">{loc.address}</div>
                    </div>
                    {typeof loc.rating === "number" && (
                      <div className="shrink-0 inline-flex items-center gap-0.5 font-mono text-[10px] text-coral">
                        <Star size={10} fill="currentColor" /> {loc.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px] text-ink-dim">
                    {loc.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={10} /> {loc.phone}
                      </span>
                    )}
                    {typeof loc.distanceKm === "number" && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={10} /> {loc.distanceKm.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  {loc.note && (
                    <div className="mt-1.5 text-[11px] text-ink leading-relaxed">{loc.note}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {ax.safetyWarnings.length > 0 && (
          <div className="mt-6 rounded-2xl border border-coral/30 bg-coral/5 p-3">
            <div className="flex items-center gap-2 text-coral font-mono text-[10px] uppercase tracking-[0.22em]">
              <ShieldAlert size={12} /> heads up
            </div>
            <ul className="mt-2 space-y-1 text-[12px] text-ink leading-relaxed">
              {ax.safetyWarnings.map((w) => <li key={w}>· {w}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-paper via-paper to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full rounded-full bg-coral text-paper font-medium py-3.5 flex items-center justify-center gap-2 glow-coral"
        >
          {ax.verdict.decision === "repair" && ax.verdict.estimatedTimeMinutes > 0
            ? "Show me how"
            : "See your report"}
        </motion.button>
      </div>
    </div>
  );
}
