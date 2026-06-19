"use client";

import { motion } from "motion/react";
import { ArrowLeft, MapPin, Camera, User, Tag } from "lucide-react";
import type { Case } from "@/lib/types";

export function CaseDetail({
  c,
  onBack,
  onAssess,
}: {
  c: Case;
  onBack: () => void;
  onAssess: () => void;
}) {
  return (
    <div className="text-ink bg-paper h-full pb-32">
      <div className="pt-12 pb-3 px-5 flex items-center justify-between">
        <button onClick={onBack} className="h-8 w-8 rounded-full border border-line flex items-center justify-center">
          <ArrowLeft size={14} />
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          {c.caseCode}
        </div>
        <div className="h-8 w-8" />
      </div>

      <div className="px-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-coral">{c.assetType}</div>
          <h1 className="font-display text-3xl leading-tight mt-1">{c.asset}</h1>
        </motion.div>

        <div className="mt-5 rounded-2xl border border-line bg-warm/30 overflow-hidden">
          <Row icon={<Tag size={14} />} label="Why you're checking" value={c.customer} />
          <Row icon={<MapPin size={14} />} label="Where" value={c.location} mono />
          <Row icon={<User size={14} />} label="You" value={c.reportedBy} />
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
            in your words
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">"{c.reportedIssue}"</p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-3 bg-gradient-to-t from-paper via-paper to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAssess}
          className="w-full rounded-full bg-coral text-paper font-medium py-3.5 flex items-center justify-center gap-2 glow-coral"
        >
          <Camera size={16} /> Snap it
        </motion.button>
        <div className="mt-2 text-center font-mono text-[10px] text-ink-dim uppercase tracking-[0.18em]">
          point at the item · we'll do the rest
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-line last:border-b-0">
      <div className="h-7 w-7 rounded-lg bg-paper border border-line flex items-center justify-center text-ink-muted">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-dim">{label}</div>
        <div className={`text-sm truncate ${mono ? "font-mono" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
