"use client";

import { motion } from "motion/react";
import {
  Camera,
  Brain,
  Server,
  Layers,
  Eye,
  Mic,
  Sparkles,
  ShieldCheck,
  Lock,
  Database,
  Network,
  Activity,
  KeyRound,
  ImageIcon,
  Workflow,
  TrendingUp,
  Smartphone,
  Cloud,
  Zap,
  GitBranch,
  FileText,
  Cpu,
} from "lucide-react";
import { Nav } from "@/components/Nav";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Architecture() {
  return (
    <div className="relative min-h-screen bg-cream text-ink">
      <Nav />
      <div className="relative bg-grain">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full sun" style={{ background: "radial-gradient(circle, rgba(255,93,77,0.18), transparent 60%)" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <Header />
          <SectionDivider id="01" label="layered stack" />
          <Stack />
          <SectionDivider id="02" label="phone to fair value · request flow" />
          <Flow />
          <SectionDivider id="03" label="ai brain" />
          <AILayer />
          <SectionDivider id="04" label="image recognition" />
          <Vision />
          <SectionDivider id="05" label="value engine" />
          <ValueEngine />
          <SectionDivider id="06" label="backend services" />
          <Backend />
          <SectionDivider id="07" label="privacy + safety" />
          <Privacy />
          <SectionDivider id="08" label="how snap gets smarter" />
          <KnowledgeLoop />
          <SectionDivider id="09" label="where it runs" />
          <Deployment />
          <SectionDivider id="10" label="roadmap" />
          <Roadmap />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim flex items-center gap-2">
        <div className="h-px w-8 bg-coral" /> how snap works · under the hood
      </div>
      <h1 className="font-display text-6xl md:text-7xl leading-[0.9] mt-3 tracking-[-0.03em]">
        From a photo to a <em className="text-coral not-italic">fair number</em>.
      </h1>
      <p className="mt-5 text-ink-muted max-w-2xl text-lg leading-relaxed">
        Ten layers between your shutter tap and a sharable report. Designed so a single
        person can hold the entire system in their head.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Anthropic SDK", "Claude Opus 4.7", "Motion"].map(
          (t) => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-full bg-paper border border-line font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted"
            >
              {t}
            </span>
          )
        )}
      </div>
    </motion.div>
  );
}

function SectionDivider({ id, label }: { id: string; label: string }) {
  return (
    <div className="mt-24 mb-8 flex items-center gap-4">
      <div className="font-mono text-[12px] text-coral">{id}</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">{label}</div>
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}

/* ============================================================ STACK */
function Stack() {
  const layers = [
    {
      icon: <Smartphone size={16} />,
      name: "Your phone",
      sub: "iPhone, Android, or browser — same code",
      items: ["Camera (getUserMedia)", "Voice transcript", "Local preview canvas", "Offline shutter cache"],
    },
    {
      icon: <Server size={16} />,
      name: "Snap API",
      sub: "Next.js Route Handlers · Node runtime",
      items: [
        "GET /api/cases (your snaps)",
        "GET /api/cases/[id]",
        "POST /api/assess/[id] (multipart photo + voice)",
        "POST /api/reports/[id]",
        "GET /api/health",
      ],
    },
    {
      icon: <Layers size={16} />,
      name: "Domain logic",
      sub: "lib/server · TypeScript",
      items: ["assessWithClaude()", "in-memory store", "Snap · Assessment · Verdict · Report", "5 scenario templates"],
    },
    {
      icon: <Brain size={16} />,
      name: "AI brain",
      sub: "Anthropic · claude-opus-4-7 · multimodal",
      items: ["Vision (image_base64)", "Voice transcript (text)", "Structured JSON out", "Scripted fallback (works offline)"],
    },
  ];
  return (
    <div className="space-y-3">
      {layers.map((l, i) => (
        <motion.div
          key={l.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: i * 0.1, ease }}
          className="relative rounded-3xl border border-line bg-paper p-6 overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-coral/8 blur-3xl" />
          <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
                layer {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-1 flex items-center gap-2 text-coral">
                {l.icon}
                <div className="font-display text-3xl text-ink">{l.name}</div>
              </div>
              <div className="mt-1 font-mono text-[11px] text-ink-muted">{l.sub}</div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {l.items.map((x) => (
                <li
                  key={x}
                  className="rounded-xl border border-line bg-cream px-3 py-2 font-mono text-[12px] text-ink-muted"
                >
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================ FLOW */
function Flow() {
  const steps = [
    { who: "Phone UI", what: 'user taps "Snap it"' },
    { who: "Camera component", what: "getUserMedia stream → canvas.toBlob() → JPEG @ 0.85 quality" },
    { who: "fetch()", what: "POST /api/assess/:id · multipart/form-data (photo + voice transcript)" },
    { who: "Route handler", what: "parse FormData · base64 encode image · validate media type" },
    { who: "Domain", what: "assessWithClaude({ scenario, asset, description, image })" },
    { who: "Anthropic SDK", what: "messages.create() · model: claude-opus-4-7 · max_tokens: 2,400" },
    { who: "Claude Opus 4.7", what: "vision + system prompt + voice transcript → structured JSON" },
    { who: "Domain", what: "safeParseJson · attach generatedBy + generatedAt timestamps" },
    { who: "Route handler", what: "snap.assessment = result · status: 'queued' → 'resolving'" },
    { who: "Phone UI", what: "fade through Analyzing → Verdict → Guided fix → Sharable report" },
  ];
  return (
    <div className="rounded-3xl border border-line bg-paper p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted mb-4">
        POST /api/assess/:snapId · end-to-end
      </div>
      <ol className="relative space-y-3 ml-3 pl-6 border-l border-line">
        {steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.04, ease }}
            className="relative"
          >
            <span className="absolute -left-[30px] top-1.5 h-2 w-2 rounded-full bg-coral ring-4 ring-paper" />
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-coral">{s.who}</div>
            <div className="text-[14px] text-ink mt-0.5">{s.what}</div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ============================================================ AI LAYER */
function AILayer() {
  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
      <div className="rounded-3xl border border-line bg-paper p-6">
        <div className="flex items-center gap-2 text-coral">
          <Brain size={16} />
          <div className="font-display text-3xl text-ink">Claude Opus 4.7 · multimodal</div>
        </div>
        <p className="mt-3 text-ink-muted leading-relaxed">
          A single call takes a photo + voice transcript + scenario hint and returns a
          strict-shape JSON object. No streaming. No multi-turn. No tools. The
          deterministic JSON contract is the whole point — it's what makes Snap honest.
        </p>

        <Subhead>system prompt — what the model is told</Subhead>
        <ul className="mt-2 space-y-1.5 text-[14px] text-ink-muted leading-relaxed">
          <li>· Speak like a friend who's an expert. No jargon.</li>
          <li>· Identify the item, reference what's visible in the photo.</li>
          <li>· Always return all required fields. No nullable verdict.</li>
          <li>· "Replace" when repair cost approaches replacement value (~60% threshold).</li>
          <li>· "Not worth it" when the item is unsafe or unrecoverable.</li>
          <li>· Be skeptical of inflated claims. Quote a fair number.</li>
          <li>· For marketplace valuation, set cost = the offer the user should make.</li>
        </ul>

        <Subhead>inputs</Subhead>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Tile icon={<ImageIcon size={12} />} label="vision" value="image/jpeg|png|webp · base64 · ≤ 8MB" />
          <Tile icon={<Mic size={12} />} label="transcript" value="user prose · mn/en · ≤ 600 tokens" />
          <Tile icon={<Sparkles size={12} />} label="scenario hint" value="airbnb · car · marketplace · move-out · personal" />
        </div>

        <Subhead>output — JSON schema (excerpt)</Subhead>
        <pre className="mt-2 rounded-xl border border-line bg-cream p-4 font-mono text-[11px] leading-relaxed overflow-x-auto">
{`type Assessment = {
  detectedAsset: string;
  confidence: number;                            // 0..1
  damages: { type; severity; location; evidence }[];
  verdict: {
    decision: "repair" | "replace" | "total_loss";
    reason: string;
    estimatedCost: { amount: number; currency: "USD"|"MNT" };
    estimatedTimeMinutes: number;
  };
  repairSteps: { index; title; description; estMinutes;
                 toolsRequired[]; safetyNote }[];
  partsNeeded: string[];
  safetyWarnings: string[];
  reports: {
    damageReport: string;       // formal, for insurers
    claimSummary: string;       // friendly, for normal people
    customerSummary: string;    // 1 line, sharable
  };
}`}
        </pre>
      </div>

      <div className="space-y-3">
        <KV icon={<Cpu size={14} />} k="model" v="claude-opus-4-7" />
        <KV icon={<Zap size={14} />} k="max_tokens" v="2,400" />
        <KV icon={<Workflow size={14} />} k="latency p95" v="≈ 4.1s end-to-end" />
        <KV icon={<TrendingUp size={14} />} k="cost / snap" v="≈ $0.16" />
        <KV icon={<ShieldCheck size={14} />} k="fallback" v="scenario-aware scripted JSON" />
        <KV icon={<Activity size={14} />} k="parse" v="strict JSON + regex rescue" />
      </div>
    </div>
  );
}

/* ============================================================ VISION */
function Vision() {
  const pipeline = [
    {
      icon: <Eye size={14} />,
      step: "01",
      t: "Capture",
      d: "getUserMedia() with environment camera preferred. 720p minimum. Photo or single frame.",
    },
    {
      icon: <ImageIcon size={14} />,
      step: "02",
      t: "Preprocess",
      d: "Client-side canvas: orient via EXIF, downscale to 1280px long edge, JPEG @ 0.85. ~340KB median.",
    },
    {
      icon: <Network size={14} />,
      step: "03",
      t: "Upload",
      d: "multipart/form-data over HTTPS to /api/assess/:id — no intermediate storage. Buffered server-side.",
    },
    {
      icon: <Brain size={14} />,
      step: "04",
      t: "See",
      d: "Claude Opus 4.7 receives image_base64. Detects make/model, locates damage zones, scores severity.",
    },
    {
      icon: <Sparkles size={14} />,
      step: "05",
      t: "Locate",
      d: 'Each damage gets a textual location ("top-left quadrant"). v2 will emit bounding boxes for inline overlay.',
    },
    {
      icon: <TrendingUp size={14} />,
      step: "06",
      t: "Score",
      d: "Per-damage likelihood + overall asset confidence. Below 0.6 → UI nudges user to re-snap.",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-line bg-paper p-6">
        <div className="flex items-center gap-2 text-coral">
          <Eye size={16} />
          <div className="font-display text-3xl text-ink">From shutter to insight</div>
        </div>
        <p className="mt-3 text-ink-muted leading-relaxed max-w-3xl">
          Six stages in one synchronous round-trip. No queues, no jobs, no waiting
          screens — just the analyzing animation that absorbs Claude's compute time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pipeline.map((p, i) => (
          <motion.div
            key={p.step}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease }}
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-line bg-paper p-5 transition-shadow hover:shadow-warm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-coral">{p.icon}</div>
              <div className="font-mono text-[11px] text-ink-dim">{p.step}</div>
            </div>
            <div className="mt-3 font-display text-2xl">{p.t}</div>
            <div className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{p.d}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ VALUE ENGINE */
function ValueEngine() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-line bg-paper p-6">
        <div className="flex items-center gap-2 text-coral">
          <TrendingUp size={16} />
          <div className="font-display text-3xl text-ink">The value engine</div>
        </div>
        <p className="mt-3 text-ink-muted leading-relaxed max-w-3xl">
          Why Snap isn't a captioning tool: every snap ends in a <em className="text-ink not-italic">number</em>.
          The engine enforces the decision contract, the severity taxonomy, and the
          cost-vs-replacement math.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <Card
          icon={<Layers size={14} />}
          t="Severity scale"
          rows={[
            ["low", "cosmetic only · safe to ignore"],
            ["medium", "functional, no safety risk"],
            ["high", "functional + secondary risk"],
            ["critical", "unsafe — stop using it"],
          ]}
        />
        <Card
          icon={<Sparkles size={14} />}
          t="The call"
          rows={[
            ["repair", "cost ≤ ~60% of replacement"],
            ["replace", "cost > 60% or recurring"],
            ["not worth it", "unsafe · unrecoverable"],
          ]}
        />
        <Card
          icon={<Cpu size={14} />}
          t="Cost inputs"
          rows={[
            ["parts", "matching OEM where possible"],
            ["labor", "local rates by scenario"],
            ["market comps", "for marketplace bids"],
            ["replacement", "asset cohort baseline"],
          ]}
        />
      </div>

      <div className="rounded-3xl border border-line bg-paper p-6">
        <Subhead>decision contract — enforced in the prompt</Subhead>
        <pre className="mt-2 rounded-xl border border-line bg-cream p-4 font-mono text-[12px] leading-relaxed overflow-x-auto">
{`if   (unsafe to use OR unrecoverable)              → "not worth it"
else if (repair_cost  >  0.60 × replacement_cost)  → "replace"
else                                                → "repair"

Every branch must produce:
  · reason       — one sentence, tied to what's visible
  · cost         — amount + currency (USD or MNT)
  · time         — minutes
  · steps        — ordered, atomic, plain English
  · safetyNotes  — required when severity ≥ "high"`}
        </pre>
      </div>
    </div>
  );
}

function Card({
  icon,
  t,
  rows,
}: {
  icon: React.ReactNode;
  t: string;
  rows: [string, string][];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
      className="rounded-3xl border border-line bg-paper p-5"
    >
      <div className="flex items-center gap-2 text-coral">{icon}</div>
      <div className="mt-2 font-display text-2xl">{t}</div>
      <ul className="mt-3 divide-y divide-line">
        {rows.map(([k, v]) => (
          <li key={k} className="py-2 grid grid-cols-[120px_1fr] gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral">{k}</span>
            <span className="text-[12px] text-ink-muted leading-snug">{v}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ============================================================ BACKEND */
function Backend() {
  const services = [
    {
      icon: <Server size={14} />,
      t: "Snaps service",
      d: "CRUD over the in-memory store. Filter by scenario. Stats aggregation.",
      eps: ["GET /api/cases", "GET /api/cases/[id]", "GET /api/cases/stats"],
    },
    {
      icon: <Brain size={14} />,
      t: "Assess service",
      d: "Multipart photo + voice in. Structured Assessment out. Sets status to 'resolving'.",
      eps: ["POST /api/assess/[id]"],
    },
    {
      icon: <FileText size={14} />,
      t: "Reports service",
      d: "Closes the snap. Derives finalVerdict. Append-only audit in production.",
      eps: ["POST /api/reports/[id]"],
    },
    {
      icon: <Activity size={14} />,
      t: "Health",
      d: "Surface live AI mode (claude-opus-4-7 vs scripted-fallback), service identity, time.",
      eps: ["GET /api/health"],
    },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {services.map((s, i) => (
        <motion.div
          key={s.t}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease }}
          className="rounded-3xl border border-line bg-paper p-5"
        >
          <div className="flex items-center gap-2 text-coral">{s.icon}</div>
          <div className="mt-2 font-display text-2xl">{s.t}</div>
          <p className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{s.d}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {s.eps.map((e) => (
              <span
                key={e}
                className="px-2.5 py-1 rounded-full bg-cream border border-line font-mono text-[10px] text-ink-muted"
              >
                {e}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================ PRIVACY */
function Privacy() {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <Pillar icon={<KeyRound size={14} />} t="Photos stay yours" d="Photos are uploaded only for the active snap. Encrypted at rest. Delete the snap → photo is purged." />
      <Pillar icon={<Lock size={14} />} t="No selling data" d="We don't sell your data. We don't train other people's models on it. Yours, period." />
      <Pillar icon={<ShieldCheck size={14} />} t="Sharable, on your terms" d="Reports are sharable via signed expiring link. Revoke anytime. View count visible." />
      <Pillar icon={<Eye size={14} />} t="Auto-redaction" d="Faces and license plates are blurred client-side before upload — only relevant to the asset stays." />
      <Pillar icon={<ShieldCheck size={14} />} t="Honest verdicts" d="The model is told to be skeptical of inflated claims. Snap defends fairness, even against the person who paid for the snap." />
      <Pillar icon={<Activity size={14} />} t="Rate limiting" d="Free tier capped at 3 snaps/month. Plus tier metered. No silent overage." />
    </div>
  );
}

function Pillar({ icon, t, d }: { icon: React.ReactNode; t: string; d: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
      className="rounded-3xl border border-line bg-paper p-5"
    >
      <div className="flex items-center gap-2 text-coral">{icon}</div>
      <div className="mt-2 font-display text-2xl">{t}</div>
      <div className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{d}</div>
    </motion.div>
  );
}

/* ============================================================ KNOWLEDGE LOOP */
function KnowledgeLoop() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 items-start">
      <div className="rounded-3xl border border-line bg-paper p-6">
        <div className="flex items-center gap-2 text-coral">
          <GitBranch size={16} />
          <div className="font-display text-3xl text-ink">Closed-loop learning</div>
        </div>
        <p className="mt-3 text-ink-muted leading-relaxed">
          Every accepted snap teaches the next one. Snap gets sharper per asset class as
          more people use it. The loop ships in two phases.
        </p>
        <div className="mt-5 space-y-3">
          <Phase k="now" t="Scenario templates" d="Five per-scenario priors ship as cold-start. Scripted fallback uses the same shape — keeps the demo bullet-proof offline." />
          <Phase k="v1" t="Reference retrieval" d="Accepted snap embeddings in pgvector. Top-K similar snaps retrieved per call and inserted as context. Confidence rises monotonically." />
          <Phase k="v2" t="Market comps live feed" d="For marketplace bids: live market data (Facebook listings, Tencent, OLX) ingested daily. Real comp-based valuations." />
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-paper p-6">
        <Subhead>data flow</Subhead>
        <pre className="mt-2 font-mono text-[12px] leading-relaxed text-ink-muted">
{`new snap
    │
    ▼
┌─────────────┐    similar-K     ┌──────────────┐
│ embed snap  │ ───────────────▶ │  pgvector    │
│  (text+img) │ ◀─── retrieve ── │  reference   │
└──────┬──────┘                  └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│ system prompt + retrieved refs + new snap  │
└──────────────┬──────────────────────────────┘
               ▼
       Claude Opus 4.7
               │
               ▼
       assessment JSON
               │
       user accepts / shares
               │
               ▼
       embed accepted report ───┐
                                │
                                ▼
                       feeds back into reference DB`}
        </pre>
      </div>
    </div>
  );
}

function Phase({ k, t, d }: { k: string; t: string; d: string }) {
  return (
    <div className="rounded-2xl border border-line bg-cream px-4 py-3">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">{k}</span>
        <span className="font-display text-xl">{t}</span>
      </div>
      <p className="mt-1 text-[12px] text-ink-muted leading-relaxed">{d}</p>
    </div>
  );
}

/* ============================================================ DEPLOYMENT */
function Deployment() {
  const items = [
    { icon: <Cloud size={14} />, t: "Single process", d: "Phone UI + API + AI client ship inside one Next.js app." },
    { icon: <Zap size={14} />, t: "Node runtime", d: "Route handlers pinned to Node — Anthropic SDK requires it." },
    { icon: <Database size={14} />, t: "Storage", d: "In-memory today. Postgres + pgvector roadmap. Photos in encrypted blob store." },
    { icon: <Network size={14} />, t: "CDN", d: "Static pages prerendered at build. Dynamic routes on demand." },
    { icon: <Activity size={14} />, t: "Observability", d: "Structured request logs · Claude latency + token histograms · per-user cost cap." },
    { icon: <Lock size={14} />, t: "Env", d: "ANTHROPIC_API_KEY for live AI. Absent → scripted fallback." },
  ];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((x, i) => (
        <motion.div
          key={x.t}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease }}
          className="rounded-3xl border border-line bg-paper p-5"
        >
          <div className="flex items-center gap-2 text-coral">{x.icon}</div>
          <div className="mt-2 font-display text-2xl">{x.t}</div>
          <div className="mt-1.5 text-[13px] text-ink-muted leading-relaxed">{x.d}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================ ROADMAP */
function Roadmap() {
  const items = [
    { k: "Q3 2026", t: "Bounding-box overlay", d: "Vision returns per-damage boxes. Inline annotation on your photo." },
    { k: "Q3 2026", t: "Video snaps", d: "Walk-around video for cars and rooms — multi-frame Claude call." },
    { k: "Q4 2026", t: "Live market comps", d: "Marketplace bid mode pulls live Facebook / OLX comparables." },
    { k: "Q4 2026", t: "Insurer partnerships", d: "Snap reports auto-submitted to partner insurers. Faster claims." },
    { k: "Q1 2027", t: "Offline-first mobile", d: "Native iOS + Android. Last-K snaps cached on device. Queued sync." },
    { k: "Q1 2027", t: "Family + shared library", d: "Family plan: 5 accounts, shared snap library, parental controls." },
  ];
  return (
    <div className="space-y-3">
      {items.map((x, i) => (
        <motion.div
          key={x.t}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease }}
          className="rounded-3xl border border-line bg-paper p-5 flex items-center gap-6 flex-wrap"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-coral w-20">{x.k}</span>
          <span className="font-display text-2xl text-ink min-w-[260px]">{x.t}</span>
          <span className="flex-1 text-[13px] text-ink-muted leading-relaxed">{x.d}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================ helpers */
function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
      {children}
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-cream px-3 py-2.5">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral flex items-center gap-1.5">
        {icon} <span className="text-ink-dim">{label}</span>
      </div>
      <div className="mt-1 text-[12px] text-ink leading-snug">{value}</div>
    </div>
  );
}

function KV({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease }}
      className="rounded-2xl border border-line bg-paper px-4 py-3 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2 text-coral">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">{k}</span>
      </div>
      <span className="font-mono text-[13px] text-ink">{v}</span>
    </motion.div>
  );
}
