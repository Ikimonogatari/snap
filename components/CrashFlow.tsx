"use client";

import { motion } from "motion/react";
import { Handshake, ShieldCheck, AlertTriangle, Phone, Gavel, Banknote, ArrowDown, ArrowRight } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

export function CrashFlow() {
  return (
    <section className="relative py-32 border-t border-line bg-paper overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(255,93,77,0.12), transparent 60%)" }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Eyebrow>the moment two cars meet</Eyebrow>
        <h2 className="mt-3 font-display text-5xl md:text-7xl leading-[0.92] tracking-[-0.025em] max-w-4xl">
          When the crash happens, the<br />
          <em className="text-coral not-italic">first ten minutes</em> decide everything.
        </h2>
        <p className="mt-6 text-ink-muted text-lg leading-relaxed max-w-2xl">
          Mongolian drivers know the playbook. Bargain on the spot, or call the police.
          If you call the police, you must call your insurance first — they validate the
          damage before the police decide who's at fault. Snap sits in the middle.
        </p>

        {/* Decision tree */}
        <div className="mt-16">
          {/* Root node */}
          <CenterNode />

          {/* Arrows down */}
          <BranchArrows />

          {/* Two paths */}
          <div className="grid lg:grid-cols-2 gap-6 mt-4">
            <BargainPath />
            <PolicePath />
          </div>

          {/* Outcome footer */}
          <Outcome />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Root ---------------- */
function CenterNode() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease }}
      className="mx-auto max-w-md text-center"
    >
      <div className="relative rounded-full border border-coral/40 bg-coral/10 px-6 py-4 inline-flex items-center gap-3 shadow-warm">
        <AlertTriangle size={18} className="text-coral" />
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-coral">crash · what now?</div>
          <div className="font-display text-2xl mt-0.5">A crash just happened.</div>
        </div>
      </div>
    </motion.div>
  );
}

function BranchArrows() {
  return (
    <div className="mt-6 grid lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        whileInView={{ opacity: 1, height: "auto" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="flex flex-col items-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">option a · small damage</div>
        <ArrowDown size={16} className="text-coral mt-1" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        whileInView={{ opacity: 1, height: "auto" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease, delay: 0.15 }}
        className="flex flex-col items-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">option b · serious damage or dispute</div>
        <ArrowDown size={16} className="text-coral mt-1" />
      </motion.div>
    </div>
  );
}

/* ---------------- Path A: bargain ---------------- */
function BargainPath() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease }}
      className="rounded-3xl border border-line bg-cream/70 p-6 shadow-warm"
    >
      <div className="flex items-center gap-2 text-coral">
        <Handshake size={16} />
        <div className="font-mono text-[10px] uppercase tracking-[0.22em]">option a · bargain</div>
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight">
        Settle <em className="text-coral not-italic">on the spot</em>.
      </h3>
      <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
        Both drivers agree it's a small one. No paint penetration, no structural damage,
        no injury. You exchange numbers, exchange money, and move on.
      </p>

      <ol className="mt-5 space-y-3">
        <Step n="01" t="Snap the damage" d="One photo of the dent, one of the panel. Snap returns a fair MNT figure in 20 seconds — backed by visible evidence." />
        <Step n="02" t="Show the other driver" d="Hand them your phone. Show the verdict. ~95,000₮ for a parking-lot bump on a Prius door is hard to argue with." />
        <Step n="03" t="Write it down + 1 witness" d="Plate numbers, time, damage, agreed amount, both signatures + one witness. QPay or bank transfer leaves a record." />
      </ol>

      <div className="mt-5 rounded-2xl border border-coral/30 bg-coral/5 p-3 flex gap-2">
        <AlertTriangle size={14} className="text-coral shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed">
          <span className="font-medium">If the other driver refuses to sign</span> — stop here. Switch to the police path. Don't accept verbal-only.
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------- Path B: police + insurance ---------------- */
function PolicePath() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay: 0.1 }}
      className="rounded-3xl border border-navy/40 bg-navy text-paper p-6 shadow-warm"
    >
      <div className="flex items-center gap-2 text-coral">
        <Gavel size={16} />
        <div className="font-mono text-[10px] uppercase tracking-[0.22em]">option b · police + insurance</div>
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight text-paper">
        Call the <em className="text-coral not-italic">traffic police</em>. But call your insurer first.
      </h3>
      <p className="mt-2 text-[14px] text-paper/75 leading-relaxed">
        Under ХАОДД (compulsory motor liability insurance), your insurer's damage
        assessment must reach the police before they assign fault. Skipping this step
        gives the other side room to argue.
      </p>

      <ol className="mt-5 space-y-3">
        <StepDark n="01" t="Snap before anyone moves" d="Wide shot, close-ups, both vehicles, plates, intersection from each driver's angle. Snap timestamps and locates every frame." />
        <StepDark n="02" t="Call your insurer" d="Mongol Daatgal · 1800-1100. Their field adjuster comes to the scene. The Snap report shaves 20–30 minutes off their work — and they can't argue your numbers if they match theirs." />
        <StepDark n="03" t="Call the traffic police · 102" d="Hand the officer your Snap report alongside the insurer's act. The report becomes visual evidence in the violation protocol — what hit what, from which direction." />
        <StepDark n="04" t="Officer decides fault. At-fault insurer pays." d="Per ХАОДД, the at-fault driver's insurance covers the repair, the tow, and (if you have full coverage) your downtime rental." />
      </ol>

      <div className="mt-5 rounded-2xl border border-coral/30 bg-coral/10 p-3 flex gap-2">
        <ShieldCheck size={14} className="text-coral shrink-0 mt-0.5" />
        <p className="text-[12px] text-paper/85 leading-relaxed">
          <span className="font-medium text-coral">Don't move the car</span> until both the insurer and the officer have seen the scene — even if traffic backs up.
        </p>
      </div>
    </motion.div>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="font-mono text-[11px] text-coral mt-0.5">{n}</span>
      <div>
        <div className="font-medium text-[14px]">{t}</div>
        <div className="text-[12px] text-ink-muted leading-relaxed mt-0.5">{d}</div>
      </div>
    </li>
  );
}

function StepDark({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="font-mono text-[11px] text-coral mt-0.5">{n}</span>
      <div>
        <div className="font-medium text-[14px] text-paper">{t}</div>
        <div className="text-[12px] text-paper/65 leading-relaxed mt-0.5">{d}</div>
      </div>
    </li>
  );
}

/* ---------------- Outcome footer ---------------- */
function Outcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease }}
      className="mt-10 rounded-3xl border border-line bg-cream p-6"
    >
      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <Phone size={22} className="text-coral shrink-0" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">step 1</div>
            <div className="font-display text-xl">You snap.</div>
          </div>
        </div>
        <div className="flex items-center gap-3 md:justify-center">
          <ArrowRight size={18} className="text-ink-dim" />
          <Banknote size={22} className="text-coral shrink-0" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">step 2</div>
            <div className="font-display text-xl">A fair number.</div>
          </div>
        </div>
        <div className="flex items-center gap-3 md:justify-end">
          <ArrowRight size={18} className="text-ink-dim" />
          <ShieldCheck size={22} className="text-coral shrink-0" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">step 3</div>
            <div className="font-display text-xl">Settled.</div>
          </div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-line grid sm:grid-cols-3 gap-4 text-center">
        <Stat k="₮180,000" v="median spot-settlement (small bumps)" />
        <Stat k="22 min" v="vs hours arguing without a number" />
        <Stat k="4 of 5" v="MN claims accepted faster with Snap-style photo evidence" />
      </div>
    </motion.div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-coral leading-none">{k}</div>
      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{v}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim flex items-center gap-2">
      <div className="h-px w-8 bg-coral" />
      {children}
    </div>
  );
}
