"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  ArrowRight,
  Camera,
  Sparkles,
  Home,
  Car,
  ShoppingBag,
  KeyRound,
  Laptop,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { LogoMark } from "@/components/Logo";
import { CursorBlob } from "@/components/motion/CursorBlob";
import { CountUp } from "@/components/motion/CountUp";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollScenarios } from "@/components/motion/ScrollScenarios";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Landing() {
  return (
    <div className="relative bg-cream text-ink overflow-x-clip">
      <CursorBlob />
      <ScrollProgress />
      <Nav />
      <Hero />
      <PinnedNarrative />
      <UseCases />
      <ScrollScenarios />
      <How />
      <Showcase />
      <Numbers />
      <CTA />
      <Footer />
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-coral z-50 origin-left"
    />
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center bg-grain">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6 }}
          className="absolute -top-32 -right-40 h-[36rem] w-[36rem] rounded-full sun"
          style={{ background: "radial-gradient(circle, rgba(255,93,77,0.32), transparent 60%)" }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full float-y"
          style={{ background: "radial-gradient(circle, rgba(12,22,38,0.10), transparent 60%)" }}
        />
      </div>

      <motion.div style={{ y, opacity: fade }} className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim"
        >
          <span className="relative inline-flex h-1.5 w-1.5 text-coral">
            <span className="pulse-dot absolute inset-0" />
            <span className="relative h-full w-full rounded-full bg-current" />
          </span>
          consumer AI · vision-first
        </motion.div>

        <h1 className="mt-6 font-display text-[clamp(60px,12vw,200px)] leading-[0.84] tracking-[-0.03em]">
          <RevealLine delay={0.05}>Snap it.</RevealLine>
          <RevealLine delay={0.18}>
            Know what it's <em className="text-coral not-italic">worth.</em>
          </RevealLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="mt-10 max-w-2xl"
        >
          <p className="text-[18px] md:text-[22px] leading-relaxed text-ink-muted">
            Point your camera at a damaged, worn, or used item. Snap returns a fair value,
            a clear recommendation, and a shareable report — in 20 seconds. For Airbnb
            hosts, drivers, marketplace traders, and anyone who's ever argued about a
            deposit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <MagneticButton>
            <Link
              href="/snap"
              className="group inline-flex items-center gap-2 rounded-full bg-coral text-paper font-medium px-6 py-3.5 glow-coral hover:bg-coral-deep transition-colors"
            >
              <Camera size={16} /> Snap something
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper px-6 py-3.5 hover:bg-warm transition-colors"
            >
              See pricing
            </Link>
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl border-t border-line pt-8"
        >
          <Pulse k={<>~<CountUp to={20} />s</>} v="snap to report" />
          <Pulse k={<>$<CountUp to={420} format="comma" /></>} v="avg saved per claim" />
          <Pulse k={<><CountUp to={94} />%</>} v="reports accepted by insurers" />
          <Pulse k={<><CountUp to={5} /></>} v="everyday scenarios" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-dim font-mono text-[10px] uppercase tracking-[0.24em]"
      >
        <span>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-6 w-px bg-coral"
        />
      </motion.div>
    </section>
  );
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function Pulse({ k, v }: { k: React.ReactNode; v: string }) {
  return (
    <div>
      <div className="font-display text-5xl text-ink leading-none">{k}</div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">{v}</div>
    </div>
  );
}

function PinnedNarrative() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const phrases = [
    { eyebrow: "every day", body: "someone argues about damage." },
    { eyebrow: "every day", body: "someone overpays for a used thing." },
    { eyebrow: "every day", body: "someone loses a deposit they shouldn't have." },
  ];
  return (
    <section ref={ref} className="relative bg-paper border-y border-line" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full sun" style={{ background: "radial-gradient(circle, rgba(255,93,77,0.10), transparent 60%)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {phrases.map((p, i) => {
            const start = i / phrases.length;
            const end = (i + 1) / phrases.length;
            return <Phrase key={i} start={start} end={end} progress={scrollYProgress} eyebrow={p.eyebrow} body={p.body} />;
          })}
          <Outro progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

function Phrase({
  start,
  end,
  progress,
  eyebrow,
  body,
}: {
  start: number;
  end: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  eyebrow: string;
  body: string;
}) {
  const opacity = useTransform(progress, [start - 0.03, start + 0.02, end - 0.05, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, end], [0, -40]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-coral">{eyebrow}</div>
      <div className="font-display text-[clamp(48px,9vw,140px)] leading-[0.92] tracking-[-0.025em] mt-4 max-w-5xl">
        {body}
      </div>
    </motion.div>
  );
}

function Outro({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const opacity = useTransform(progress, [0.85, 0.95], [0, 1]);
  const y = useTransform(progress, [0.85, 0.95], [20, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink-dim">enter</div>
      <div className="font-display text-[clamp(64px,12vw,200px)] leading-[0.88] tracking-[-0.03em] mt-4">
        <em className="text-coral not-italic">Snap.</em>
      </div>
    </motion.div>
  );
}

function UseCases() {
  const cases = [
    { icon: <Home size={18} />, tag: "Airbnb hosts", h: "Guest broke a lamp.", d: "Snap the damage. Snap returns a fair claim amount you can show your guest — no arguing, no inflated guess.", pop: "+$120 fair claim" },
    { icon: <Car size={18} />, tag: "Drivers", h: "Someone scuffed your door.", d: "Snap the dent. Get an insurer-ready report and a repair estimate in under a minute. Beat the other driver to the claim.", pop: "$280 PDR estimate" },
    { icon: <ShoppingBag size={18} />, tag: "Marketplace buyers", h: "Is this used phone overpriced?", d: "Snap the listing photos. Snap tells you what it's actually worth — and how much to counter-offer.", pop: "Counter ₮1.3M" },
    { icon: <KeyRound size={18} />, tag: "Renters moving out", h: "Landlord wants the deposit.", d: "Snap the wall stain, the floor scuff, the loose hinge. Snap separates normal wear from real damage. Keep your deposit.", pop: "Wear-and-tear only" },
    { icon: <Laptop size={18} />, tag: "Insurance claims", h: "Coffee on your laptop.", d: "Snap the damage. Snap drafts the damage report your insurer expects — and tells you what NOT to do next.", pop: "$320 covered" },
  ];
  return (
    <section className="relative py-32 border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>five real scenarios</Eyebrow>
        <h2 className="mt-3 font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em] max-w-3xl">
          The moments where <em className="text-coral not-italic">$50 to $5,000</em> hang on a guess.
        </h2>
        <p className="mt-5 text-ink-muted max-w-xl leading-relaxed">
          Snap replaces the guess with a sourced number you can show another person. Built for these five everyday situations.
        </p>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.06, ease }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-line bg-cream/60 p-6 transition-shadow hover:shadow-warm"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-coral/15 border border-coral/30 text-coral flex items-center justify-center">
                  {c.icon}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{c.tag}</div>
              </div>
              <h3 className="mt-5 font-display text-2xl leading-tight">{c.h}</h3>
              <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">{c.d}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-warm/50 border border-line px-3 py-1.5 font-mono text-[11px] text-coral">
                <Sparkles size={11} />
                {c.pop}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    { k: "01", t: "Snap a photo", d: "Open Snap, point at the item, tap. Use your camera — your phone is the whole app." },
    { k: "02", t: "Tell us why", d: "One line in your own words. Mongolian, English, whatever. Snap listens." },
    { k: "03", t: "Get the call", d: "In under 20 seconds: fair value, what to do, and why. Backed by visible evidence." },
    { k: "04", t: "Share the report", d: "PDF or link. For your insurer, your guest, your landlord, or the marketplace seller." },
  ];
  return (
    <section className="relative py-32 border-t border-line bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>how it works</Eyebrow>
        <h2 className="mt-3 font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
          Four steps. <em className="text-coral not-italic">No paperwork.</em>
        </h2>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.06, ease }}
              className="relative rounded-3xl border border-line bg-paper p-6"
            >
              <div className="font-mono text-[40px] text-coral leading-none">{s.k}</div>
              <h3 className="mt-3 font-display text-2xl">{s.t}</h3>
              <p className="mt-2 text-[13px] text-ink-muted leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="relative py-32 border-t border-line bg-paper overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
        <div>
          <Eyebrow>see it in action</Eyebrow>
          <h2 className="mt-3 font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
            The whole demo lives <em className="text-coral not-italic">on this site</em>.
          </h2>
          <p className="mt-5 text-ink-muted leading-relaxed text-lg max-w-md">
            Pick one of five real scenarios, open the camera, snap a photo, and watch the verdict come back. Permission allowed → live AI. Permission denied → identical shape, still works.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/snap" className="inline-flex items-center gap-2 rounded-full bg-coral text-paper font-medium px-6 py-3.5 glow-coral hover:bg-coral-deep transition-colors">
              <Camera size={16} /> Open the demo
            </Link>
            <Link href="/history" className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-cream px-6 py-3.5 hover:bg-warm transition-colors">
              See past snaps
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-coral/15 blur-3xl rounded-full" />
          <div className="relative rounded-3xl border border-line bg-cream p-6 shadow-warm">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim flex items-center gap-2">
                <Sparkles size={11} className="text-coral" /> sample report
              </div>
              <div className="font-mono text-[10px] text-ink-dim">SNP-1001</div>
            </div>
            <h3 className="font-display text-3xl mt-3">Designer floor lamp · cracked shade</h3>
            <div className="mt-5 rounded-2xl border border-mint/40 bg-mint/10 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-mint">the call</div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="font-display text-4xl text-mint">Replace shade.</span>
                <span className="font-mono text-base">$65</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink">
                The shade is part of the lamp's value — and shades on this style are sold separately. Replacing just the shade is far cheaper than the full lamp.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px]">
              <Tile label="time" value="~20 min" />
              <Tile label="parts" value="1 drum shade" />
            </div>
            <p className="mt-5 text-[13px] text-ink-muted leading-relaxed">
              <span className="text-ink font-medium">For your guest:</span> "Shade-only replacement — about $65 is a fair claim."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper px-3 py-2">
      <div className="text-ink-dim uppercase tracking-[0.18em] text-[9px]">{label}</div>
      <div className="mt-1 text-[12px]">{value}</div>
    </div>
  );
}

function Numbers() {
  return (
    <section className="relative py-32 border-t border-line bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <Eyebrow>real impact</Eyebrow>
        <h2 className="mt-3 font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
          The arguments <em className="text-coral not-italic">end here</em>.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          <Big k={<>~<CountUp to={20} />s</>} v="snap to a clear, fair answer" />
          <Big k={<>$<CountUp to={420} format="comma" /></>} v="median saved per disputed claim in pilot" />
          <Big k={<><CountUp to={94} />%</>} v="reports accepted by insurers without follow-up" />
        </div>
      </div>
    </section>
  );
}

function Big({ k, v }: { k: React.ReactNode; v: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-line bg-paper p-8 shadow-warm"
    >
      <div className="font-display text-7xl text-coral leading-none">{k}</div>
      <div className="mt-4 text-[14px] text-ink-muted leading-relaxed">{v}</div>
    </motion.div>
  );
}

function CTA() {
  return (
    <section className="relative py-40 border-t border-line bg-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full sun" style={{ background: "radial-gradient(circle, rgba(255,93,77,0.18), transparent 60%)" }} />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="font-display text-[clamp(60px,11vw,180px)] leading-[0.88] tracking-[-0.03em]"
        >
          Snap <em className="text-coral not-italic">something</em>.
        </motion.h2>
        <p className="mt-6 max-w-xl mx-auto text-ink-muted text-lg">
          Free for the first three snaps. No card. No sign-up wall.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton>
            <Link href="/snap" className="inline-flex items-center gap-2 rounded-full bg-coral text-paper font-medium px-7 py-3.5 glow-coral hover:bg-coral-deep transition-colors">
              <Camera size={16} /> Open the camera
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper px-7 py-3.5 hover:bg-warm transition-colors">
              See plans
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-ink-dim">
        <LogoMark size={32} />
        <div className="uppercase tracking-[0.22em]">«өөрийн зурагнаас үнэлэлт»</div>
        <div className="uppercase tracking-[0.22em]">snap · 2026</div>
      </div>
    </footer>
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
