"use client";

import { motion } from "motion/react";
import { Check, FileText, MessageSquare, FileCheck2, Share2, Download } from "lucide-react";
import type { Assessment as Ax, Case } from "@/lib/types";
import { money, timeShort } from "@/lib/format";

const verdictMap = {
  repair: "Fixable",
  replace: "Replace",
  total_loss: "Not worth it",
} as const;

export function Report({ c, ax, onClose }: { c: Case; ax: Ax; onClose: () => void }) {
  return (
    <div className="text-ink bg-paper h-full flex flex-col pb-24">
      <div className="pt-12 px-5 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className="h-16 w-16 rounded-full bg-coral/15 border border-coral/40 flex items-center justify-center glow-coral"
        >
          <Check size={28} className="text-coral" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <div className="mt-5 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">
            {c.caseCode} · ready to share
          </div>
          <h1 className="font-display text-3xl mt-1">
            <em className="not-italic">Your report.</em>
          </h1>
        </motion.div>
      </div>

      <div className="px-5 mt-6 flex-1 overflow-y-auto">
        <Box icon={<FileText size={11} />} title="for the other person">
          <p className="text-[12px] leading-relaxed text-ink-muted">{ax.reports.damageReport}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">
            <Field label="Call" value={verdictMap[ax.verdict.decision]} />
            <Field label="Fair amount" value={money(ax.verdict.estimatedCost.amount, ax.verdict.estimatedCost.currency)} success />
          </div>
        </Box>

        <Box icon={<FileCheck2 size={11} />} title="quick summary">
          <p className="text-[12px] leading-relaxed text-ink-muted">{ax.reports.claimSummary}</p>
        </Box>

        <Box icon={<MessageSquare size={11} />} title="short version">
          <p className="text-[12px] leading-relaxed text-ink-muted">"{ax.reports.customerSummary}"</p>
        </Box>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-full border border-line bg-warm/40 py-2.5 flex items-center justify-center gap-1.5 text-[12px] font-medium">
            <Share2 size={12} /> Share
          </button>
          <button className="rounded-full border border-line bg-warm/40 py-2.5 flex items-center justify-center gap-1.5 text-[12px] font-medium">
            <Download size={12} /> PDF
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-paper via-paper to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full rounded-full bg-coral text-paper font-medium py-3.5 glow-coral"
        >
          Done · snap another
        </motion.button>
      </div>
    </div>
  );
}

function Box({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-warm/30 p-4 mt-3 first:mt-0">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-ink-dim">
        {icon} {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Field({ label, value, success }: { label: string; value: string; success?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-2.5">
      <div className="text-ink-dim uppercase tracking-[0.18em] text-[9px]">{label}</div>
      <div className={`mt-1 text-[13px] ${success ? "text-coral" : "text-ink"}`}>{value}</div>
    </div>
  );
}
