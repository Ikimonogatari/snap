# Snap — Know what it's worth

> MCS Ideathon 2026 · Team 10 (B2C variant)
> Tagline: **Snap it. Know what it's worth.**

Consumer-facing AI app. Snap a photo of a damaged or used item. Get a fair value,
a clear recommendation, and a shareable report — in 20 seconds.

## Five real scenarios

1. **Airbnb hosts** — guest broke something. Get a fair claim, not an argument.
2. **Drivers** — fender bender or parking-lot scuff. Get an insurer-ready report.
3. **Marketplace buyers** — is this used phone overpriced? Counter with a sourced number.
4. **Renters moving out** — landlord wants the deposit. Separate normal wear from real damage.
5. **Personal insurance claims** — coffee on a laptop. Snap drafts the claim report.

## Run

```bash
npm install
npm run dev
# → http://localhost:3000  (or :3001 if team10 is already on :3000)
```

Optional live AI:
```bash
cp .env.example .env.local
# fill ANTHROPIC_API_KEY
```

## What's inside

```
team10-2/
├── app/
│   ├── page.tsx              Cinematic landing (warm cream + coral)
│   ├── snap/page.tsx         Phone-frame demo flow (camera → assessment)
│   ├── history/page.tsx      My snaps history
│   ├── pricing/page.tsx      Consumer pricing tiers (Free, Plus, Family)
│   └── api/
│       ├── cases/            list, [id], stats
│       ├── assess/[id]       POST multipart → Claude → assessment
│       ├── reports/[id]      POST → close snap
│       └── health
├── components/
│   ├── Nav, Logo, PhoneFrame, motion/*
│   └── screens/              CaseList, CaseDetail, Capture (real webcam),
│                             Analyzing, Assessment, GuidedFix, Report
└── lib/
    ├── types.ts
    ├── api.ts
    ├── format.ts
    └── server/
        ├── ai/assess.ts      Claude Opus 4.7 with B2C-flavored prompts
        └── data/seed.ts      5 sample snaps across the use cases
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion · lucide-react · Anthropic SDK.

## Difference from team10

- **Brand**: Snap (consumer) vs Verdict (B2B)
- **Theme**: warm cream + coral vs industrial charcoal + lime
- **Fonts**: Newsreader serif (friendly editorial) vs Instrument Serif (industrial editorial)
- **Routes**: /snap, /history, /pricing vs /assess, /console, /admin, /architecture
- **Tone**: friendly, plain-English vs technical, structured
- **AI prompt**: tuned for individual users, fair-value language, "the call" vs "verdict"
- **Camera**: same real-webcam capture pipeline
