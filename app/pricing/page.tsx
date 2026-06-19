"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { Nav } from "@/components/Nav";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "/forever",
    desc: "For the occasional snap.",
    perks: [
      "3 snaps per month",
      "Standard quality assessment",
      "Shareable report (PNG)",
      "30-day history",
    ],
    cta: "Get started",
    href: "/snap",
    featured: false,
  },
  {
    name: "Plus",
    price: "4",
    period: "/month",
    desc: "For hosts, drivers, and traders.",
    perks: [
      "Unlimited snaps",
      "Priority assessment (faster)",
      "PDF reports for insurers + hosts",
      "Unlimited history",
      "Multiple photos per snap",
      "Counter-offer suggestions for marketplace",
    ],
    cta: "Start 14-day trial",
    href: "/snap",
    featured: true,
  },
  {
    name: "Family",
    price: "9",
    period: "/month",
    desc: "Up to 5 accounts. One bill.",
    perks: [
      "Everything in Plus",
      "5 family members",
      "Shared snap library",
      "Parental controls",
      "Family chat with auto-summaries",
    ],
    cta: "Set up family",
    href: "/snap",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="relative min-h-screen bg-cream text-ink">
      <Nav />
      <div className="relative bg-grain">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">pricing</div>
            <h1 className="font-display text-6xl md:text-7xl leading-[0.92] mt-2 tracking-[-0.02em]">
              Snap more. <em className="text-coral not-italic">Pay less.</em>
            </h1>
            <p className="mt-5 text-ink-muted text-lg max-w-xl mx-auto">
              Free for the occasional snap. A few bucks a month if you're hosting,
              driving, or buying and selling often.
            </p>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-3 gap-4">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className={`relative rounded-3xl p-7 ${
                  p.featured
                    ? "bg-navy text-paper shadow-warm border border-navy"
                    : "bg-paper border border-line"
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-coral text-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]">
                    <Sparkles size={11} /> most popular
                  </div>
                )}
                <div className={`font-display text-3xl ${p.featured ? "text-paper" : "text-ink"}`}>{p.name}</div>
                <div className={`mt-1 text-sm ${p.featured ? "text-paper/70" : "text-ink-muted"}`}>{p.desc}</div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`font-display text-6xl leading-none ${p.featured ? "text-paper" : "text-ink"}`}>
                    ${p.price}
                  </span>
                  <span className={`font-mono text-[12px] ${p.featured ? "text-paper/60" : "text-ink-dim"}`}>
                    {p.period}
                  </span>
                </div>

                <ul className="mt-7 space-y-2.5">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-[14px]">
                      <Check size={14} className={`mt-1 shrink-0 ${p.featured ? "text-coral" : "text-mint"}`} />
                      <span className={p.featured ? "text-paper/85" : "text-ink-muted"}>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className={`mt-8 inline-flex items-center justify-center w-full rounded-full font-medium py-3 transition-colors ${
                    p.featured
                      ? "bg-coral text-paper hover:bg-coral-deep"
                      : "bg-warm/40 border border-line text-ink hover:bg-warm"
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-line bg-paper p-8 max-w-4xl mx-auto text-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">need more?</div>
            <h3 className="font-display text-3xl mt-2">
              Business and insurer plans <em className="text-coral not-italic">on request</em>.
            </h3>
            <p className="mt-3 text-ink-muted">
              Bulk pricing for property managers, hosts with 10+ listings, fleet operators, and insurers
              who want to embed Snap reports into their claims pipeline.
            </p>
            <a
              href="mailto:hello@snap.team"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-warm/40 px-5 py-2.5 font-medium hover:bg-warm transition-colors"
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
