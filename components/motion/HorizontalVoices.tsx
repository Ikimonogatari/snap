"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Quote } from "lucide-react";

const quotes = [
  {
    q: "My guest's kid broke a lamp. Snap told me it was the shade only — $65, not the $400 lamp. Guest paid. No drama.",
    who: "Tuya · Airbnb host, UB",
    tag: "Airbnb",
  },
  {
    q: "Bid on a used iPhone for ₮1.8M. Snap told me ₮1.3M was fair. I offered ₮1.35M, seller took it.",
    who: "Khan · marketplace buyer",
    tag: "Marketplace",
  },
  {
    q: "Insurance had me write reports by hand. Snap drafts them. Approved same day.",
    who: "Anu · MacBook spill claim",
    tag: "Insurance",
  },
  {
    q: "My landlord wanted my whole deposit for a wall stain. Snap said it was wear. I kept ₮2.8M.",
    who: "Bilegma · tenant, Sukhbaatar",
    tag: "Move-out",
  },
  {
    q: "Hit-and-run in a parking lot. PDR estimate in 40 seconds. My adjuster said it was the cleanest claim he'd seen all month.",
    who: "Munkh · driver",
    tag: "Auto",
  },
];

export function HorizontalVoices() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // shift the horizontal track from 0 to -75% (we have 5 cards, slightly wider than viewport)
  const x = useTransform(scrollYProgress, [0, 1], ["8vw", "-78vw"]);

  return (
    <section ref={ref} className="relative bg-cream border-t border-line" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,93,77,0.12), transparent 60%)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim flex items-center gap-2">
            <div className="h-px w-8 bg-coral" /> from the pilot · scroll
          </div>
          <h2 className="mt-3 font-display text-5xl md:text-7xl leading-[0.92] tracking-[-0.025em] max-w-3xl">
            Quiet wins, <em className="text-coral not-italic">real money</em>.
          </h2>
        </div>

        <motion.div style={{ x }} className="relative z-10 mt-10 flex gap-6 px-[8vw] will-change-transform">
          {quotes.map((q, i) => (
            <figure
              key={q.who}
              className="shrink-0 rounded-3xl border border-line bg-paper p-7 shadow-warm flex flex-col"
              style={{ width: "min(34rem, 80vw)" }}
            >
              <div className="flex items-center justify-between">
                <Quote size={24} className="text-coral" />
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
                  {String(i + 1).padStart(2, "0")} · {q.tag}
                </div>
              </div>
              <blockquote className="mt-5 font-display text-3xl md:text-4xl leading-[1.1] text-ink tracking-[-0.015em]">
                "{q.q}"
              </blockquote>
              <figcaption className="mt-auto pt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                — {q.who}
              </figcaption>
            </figure>
          ))}
        </motion.div>

        <BottomProgress progress={scrollYProgress} />
      </div>
    </section>
  );
}

function BottomProgress({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const w = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute bottom-6 left-0 right-0 px-6 z-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          <span>scroll</span>
          <div className="relative h-px flex-1 bg-line">
            <motion.div style={{ width: w }} className="absolute inset-y-0 left-0 bg-coral" />
          </div>
          <span>5 voices</span>
        </div>
      </div>
    </div>
  );
}
