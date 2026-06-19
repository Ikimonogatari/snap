"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import { Nav } from "@/components/Nav";

const snaps = [
  { code: "SNP-1001", asset: "Designer floor lamp", verdict: "Replace shade", cost: "$65", when: "2h ago", kind: "Airbnb damage" },
  { code: "SNP-1002", asset: "Hyundai Sonata · rear door", verdict: "Fixable · PDR", cost: "$280", when: "yesterday", kind: "Car damage" },
  { code: "SNP-1003", asset: "iPhone 13 Pro 256GB", verdict: "Buy at ₮1.3M", cost: "₮1,300,000", when: "yesterday", kind: "Marketplace bid" },
  { code: "SNP-1004", asset: "Rental flat · walls + floor", verdict: "Normal wear", cost: "$45", when: "2d ago", kind: "Move-out" },
  { code: "SNP-1005", asset: "MacBook Air M2 · liquid", verdict: "Fixable", cost: "$320", when: "3d ago", kind: "Insurance prep" },
  { code: "SNP-0998", asset: "Persian rug · stained", verdict: "Pro clean", cost: "$120", when: "1w ago", kind: "Airbnb damage" },
  { code: "SNP-0991", asset: "Toyota Prius · cracked headlight", verdict: "Fixable", cost: "$180", when: "1w ago", kind: "Car damage" },
];

export default function History() {
  return (
    <div className="relative min-h-screen bg-cream text-ink">
      <Nav />
      <div className="relative bg-grain">
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim flex items-center gap-2">
              <div className="h-px w-8 bg-coral" /> your snaps
            </div>
            <h1 className="font-display text-6xl leading-[0.95] mt-2 tracking-[-0.02em]">
              Everything you've <em className="text-coral not-italic">snapped</em>.
            </h1>
            <p className="mt-4 text-ink-muted text-lg max-w-xl">
              Every report stays in your account. Share them, attach to claims, or just
              keep them for the record.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-3">
            {snaps.map((s, i) => (
              <motion.div
                key={s.code}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-line bg-paper p-5 flex items-center gap-5 hover:border-coral/30 transition-colors cursor-pointer shadow-warm"
              >
                <div className="h-14 w-14 rounded-xl bg-warm/60 border border-line flex items-center justify-center text-ink-muted">
                  <Camera size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-dim uppercase tracking-[0.2em]">{s.code}</span>
                    <span className="px-2 py-0.5 rounded-full bg-warm/60 border border-line text-[9px] font-mono uppercase text-ink-muted">
                      {s.kind}
                    </span>
                    <span className="font-mono text-[10px] text-ink-dim">· {s.when}</span>
                  </div>
                  <div className="mt-1 text-[15px] font-medium truncate">{s.asset}</div>
                  <div className="mt-1 text-[13px] text-ink-muted">{s.verdict}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl text-coral">{s.cost}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim mt-0.5">fair value</div>
                </div>
                <ChevronRight size={18} className="text-ink-dim" />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/snap"
              className="inline-flex items-center gap-2 rounded-full bg-coral text-paper px-6 py-3 font-medium glow-coral hover:bg-coral-deep transition-colors"
            >
              <Camera size={16} /> Snap something new
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
