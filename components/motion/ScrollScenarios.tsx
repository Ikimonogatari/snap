"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Home, Car, ShoppingBag, KeyRound, Laptop, Sparkles } from "lucide-react";

const scenarios = [
  {
    k: "01",
    tag: "Airbnb host",
    icon: <Home size={14} />,
    headline: "Guest broke a lamp.",
    sub: "You snap the shade.",
    verdict: "Replace shade",
    amount: "$65",
    color: "mint",
    narrative:
      "The lamp body is fine. The shade is sold separately on West Elm — about $65. That's the fair claim, not the $400 the whole lamp cost.",
  },
  {
    k: "02",
    tag: "Driver",
    icon: <Car size={14} />,
    headline: "Someone scuffed your door.",
    sub: "You snap the dent.",
    verdict: "Fixable · PDR",
    amount: "$280",
    color: "mint",
    narrative:
      "Paintless dent repair plus a paint blend. Three hours at a body shop. Two quotes attached. Most insurers approve PDR under $500 same-day.",
  },
  {
    k: "03",
    tag: "Marketplace buyer",
    icon: <ShoppingBag size={14} />,
    headline: "Used iPhone — overpriced?",
    sub: "You snap the listing.",
    verdict: "Counter at ₮1.3M",
    amount: "₮1,300,000",
    color: "coral",
    narrative:
      "Fair market for this cosmetic condition is ₮1.25M–₮1.4M. The seller's asking ₮1.8M. Counter ₮1.35M. Walk away above ₮1.45M.",
  },
  {
    k: "04",
    tag: "Renter moving out",
    icon: <KeyRound size={14} />,
    headline: "Landlord wants the deposit.",
    sub: "You snap the wear.",
    verdict: "Normal wear",
    amount: "$45 max",
    color: "mint",
    narrative:
      "Wall discoloration and a finish-level floor scuff are wear-and-tear by Mongolian tenancy law. Reasonable touch-up is $45 in materials — not the deposit.",
  },
  {
    k: "05",
    tag: "Insurance claim",
    icon: <Laptop size={14} />,
    headline: "Coffee on your laptop.",
    sub: "You snap the damage.",
    verdict: "Fixable",
    amount: "$320",
    color: "mint",
    narrative:
      "Trackpad assembly swap plus a contact clean. Don't power on. Report drafted in the language your insurer expects. Approved same day.",
  },
];

export function ScrollScenarios() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative bg-paper" style={{ height: `${scenarios.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <BackgroundOrbs progress={scrollYProgress} />
        <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_auto_1fr] gap-12 items-center w-full z-10">
          {/* LEFT — anchored eyebrow + scenario list */}
          <div className="hidden lg:block">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim flex items-center gap-2">
              <div className="h-px w-8 bg-coral" /> five scenarios · scroll
            </div>
            <h2 className="font-display text-5xl xl:text-7xl leading-[0.92] mt-3 tracking-[-0.025em]">
              Watch <em className="text-coral not-italic">it work.</em>
            </h2>
            <ul className="mt-10 space-y-3">
              {scenarios.map((s, i) => (
                <ScenarioRow key={s.k} i={i} total={scenarios.length} progress={scrollYProgress} s={s} />
              ))}
            </ul>
          </div>

          {/* CENTER — phone with morphing screen */}
          <div className="flex justify-center">
            <PhoneStack progress={scrollYProgress} />
          </div>

          {/* RIGHT — animated narrative */}
          <div className="hidden lg:block relative h-[420px]">
            {scenarios.map((s, i) => {
              const start = i / scenarios.length;
              const end = (i + 1) / scenarios.length;
              return <NarrativePanel key={s.k} start={start} end={end} s={s} progress={scrollYProgress} />;
            })}
          </div>
        </div>

        {/* progress strip */}
        <BottomProgress progress={scrollYProgress} />
      </div>
    </section>
  );
}

/* ---------------- Background orbs that shift as you scroll ---------------- */
function BackgroundOrbs({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const x = useTransform(progress, [0, 1], [-200, 200]);
  const x2 = useTransform(progress, [0, 1], [200, -200]);
  const sx = useSpring(x, { stiffness: 60, damping: 22 });
  const sx2 = useSpring(x2, { stiffness: 60, damping: 22 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ x: sx }}
        className="absolute top-1/3 -left-40 h-[34rem] w-[34rem] rounded-full"
        // background painted via CSS var
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, rgba(255,93,77,0.22), transparent 60%)" }} />
      </motion.div>
      <motion.div
        style={{ x: sx2 }}
        className="absolute bottom-1/4 -right-40 h-[30rem] w-[30rem] rounded-full"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, rgba(12,22,38,0.10), transparent 60%)" }} />
      </motion.div>
    </div>
  );
}

/* ---------------- Scenario row in left list ---------------- */
function ScenarioRow({
  i,
  total,
  progress,
  s,
}: {
  i: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  s: (typeof scenarios)[number];
}) {
  const start = i / total;
  const end = (i + 1) / total;
  const opacity = useTransform(progress, [start - 0.06, start, end, end + 0.06], [0.3, 1, 1, 0.3]);
  const x = useTransform(progress, [start - 0.06, start, end + 0.06], [-6, 0, 8]);
  const scale = useTransform(progress, [start - 0.06, start, end, end + 0.06], [0.96, 1, 1, 0.96]);
  return (
    <motion.li style={{ opacity, x, scale }} className="flex items-baseline gap-4">
      <span className="font-mono text-[11px] text-coral">{s.k}</span>
      <span className="font-display text-3xl xl:text-4xl text-ink leading-tight">{s.headline}</span>
    </motion.li>
  );
}

/* ---------------- Right narrative panel ---------------- */
function NarrativePanel({
  start,
  end,
  s,
  progress,
}: {
  start: number;
  end: number;
  s: (typeof scenarios)[number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, [start - 0.04, start, end, end + 0.04], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.04, start, end + 0.04], [24, 0, -24]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex items-center">
      <div className="rounded-3xl border border-line bg-cream/80 backdrop-blur p-6 shadow-warm">
        <div className="flex items-center gap-2 text-coral">
          {s.icon}
          <div className="font-mono text-[10px] uppercase tracking-[0.22em]">{s.tag}</div>
        </div>
        <h3 className="font-display text-3xl mt-3 leading-tight">
          <em className="not-italic">{s.sub}</em>
        </h3>
        <p className="mt-3 text-[14px] text-ink-muted leading-relaxed">{s.narrative}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint/15 border border-mint/40 px-3 py-1.5 font-mono text-[11px] text-mint">
          <Sparkles size={11} />
          {s.verdict} · {s.amount}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Bottom progress strip ---------------- */
function BottomProgress({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const w = useTransform(progress, [0, 1], ["0%", "100%"]);
  const smooth = useSpring(w, { stiffness: 80, damping: 22 });
  return (
    <div className="absolute bottom-6 left-0 right-0 px-6 z-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
          <span>scroll</span>
          <div className="relative h-px flex-1 bg-line">
            <motion.div style={{ width: smooth }} className="absolute inset-y-0 left-0 bg-coral" />
          </div>
          <span>five scenarios</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Phone stack ---------------- */
function PhoneStack({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const tilt = useTransform(progress, [0, 1], [4, -4]);
  const rotate = useTransform(progress, [0, 1], [-1.5, 1.5]);
  return (
    <motion.div style={{ rotateX: tilt, rotateZ: rotate }} className="relative">
      <div
        className="relative rounded-[44px] p-[10px] shadow-[0_70px_140px_-30px_rgba(12,22,38,0.45),0_0_0_1px_rgba(255,255,255,0.6)_inset]"
        style={{
          width: 320,
          height: 660,
          background: "linear-gradient(to bottom, #1a2230, #0c1626)",
        }}
      >
        <div className="relative h-full w-full rounded-[36px] overflow-hidden bg-paper">
          <div className="phone-notch" />
          {scenarios.map((_, i) => (
            <PhoneScreen key={i} idx={i} total={scenarios.length} progress={progress} />
          ))}
          {/* screen reflection */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18), transparent 30%, transparent 70%, rgba(255,93,77,0.05))",
            }}
          />
        </div>
      </div>
      <div className="absolute -right-[3px] top-32 h-20 w-[3px] rounded-r-full bg-[#0c1626]" />
      <div className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l-full bg-[#0c1626]" />
      <div className="absolute -left-[3px] top-44 h-16 w-[3px] rounded-l-full bg-[#0c1626]" />
    </motion.div>
  );
}

function PhoneScreen({
  idx,
  total,
  progress,
}: {
  idx: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = idx / total;
  const end = (idx + 1) / total;
  const opacity = useTransform(progress, [start - 0.05, start, end - 0.02, end + 0.02], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.05, start, end + 0.02], [40, 0, -40]);
  const s = scenarios[idx];
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0">
      <ScreenCard s={s} />
    </motion.div>
  );
}

function ScreenCard({ s }: { s: (typeof scenarios)[number] }) {
  return (
    <div className="h-full p-5 pt-14 flex flex-col text-ink">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-coral">
          {s.icon}
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">{s.tag}</span>
        </div>
        <div className="font-mono text-[10px] text-ink-dim">SNP-{1000 + parseInt(s.k)}</div>
      </div>
      <h2 className="font-display text-[26px] leading-[1.05] mt-4">{s.headline}</h2>

      {/* photo placeholder area with subtle pattern */}
      <div className="mt-4 rounded-2xl border border-line bg-warm/50 h-40 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,93,77,0.06), transparent 50%)",
        }} />
        <div className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">photo · captured</div>
      </div>

      {/* verdict */}
      <div className="mt-4 rounded-2xl border border-mint/40 bg-mint/10 p-3.5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mint">
          <Sparkles size={11} /> the call
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <span className="font-display text-2xl text-mint leading-none">
            <em className="not-italic">{s.verdict}.</em>
          </span>
          <span className="font-mono text-sm text-ink">{s.amount}</span>
        </div>
      </div>

      {/* customer line */}
      <div className="mt-3 text-[11px] text-ink-muted leading-relaxed">{s.narrative.slice(0, 110)}…</div>

      <div className="mt-auto pt-4">
        <button className="w-full rounded-full bg-coral text-paper font-medium py-2.5 text-sm">
          Share the report
        </button>
      </div>
    </div>
  );
}
