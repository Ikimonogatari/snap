"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nav } from "@/components/Nav";
import { PhoneFrame } from "@/components/PhoneFrame";
import { CaseList } from "@/components/screens/CaseList";
import { CaseDetail } from "@/components/screens/CaseDetail";
import { Capture } from "@/components/screens/Capture";
import { Analyzing } from "@/components/screens/Analyzing";
import { Assessment } from "@/components/screens/Assessment";
import { GuidedFix } from "@/components/screens/GuidedFix";
import { Report } from "@/components/screens/Report";
import type { Case, Assessment as Ax } from "@/lib/types";
import * as api from "@/lib/api";

type Screen = "list" | "detail" | "capture" | "analyzing" | "assessment" | "guide" | "report";

export default function SnapPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [screen, setScreen] = useState<Screen>("list");
  const [caseId, setCaseId] = useState<string | null>(null);
  const [ax, setAx] = useState<Ax | null>(null);
  const [analyzeDone, setAnalyzeDone] = useState(false);

  useEffect(() => {
    api.getCases().then(setCases).catch(() => setCases([]));
  }, []);

  const c = cases.find((x) => x.id === caseId) ?? null;

  async function runAssessment(id: string, blob: Blob | null) {
    setScreen("analyzing");
    setAnalyzeDone(false);
    const description = c?.reportedIssue ?? "";
    const photo = blob ? new File([blob], `snap-${id}.jpg`, { type: "image/jpeg" }) : undefined;
    try {
      const [result] = await Promise.all([
        api.assess(id, description, photo),
        new Promise((r) => setTimeout(r, 3200)),
      ]);
      setAx(result);
      setAnalyzeDone(true);
      setTimeout(() => setScreen("assessment"), 500);
    } catch {
      setScreen("assessment");
    }
  }

  return (
    <div className="relative min-h-screen bg-cream text-ink overflow-x-clip">
      <Nav />
      <div className="relative bg-grain">
        {/* warm gradient backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-40 h-[28rem] w-[28rem] rounded-full sun" style={{ background: "radial-gradient(circle, rgba(255,93,77,0.22), transparent 60%)" }} />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full float-y" style={{ background: "radial-gradient(circle, rgba(12,22,38,0.06), transparent 60%)" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">
              the live demo
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.92] mt-2 tracking-[-0.02em]">
              Snap it.<br />
              <em className="text-coral not-italic">Know what it's worth.</em>
            </h1>
            <p className="mt-6 text-ink-muted max-w-md leading-relaxed text-lg">
              Pick a real-life scenario, point your camera at the item, and let Snap return a
              fair value and a shareable report. The camera is real, the AI is real — the
              whole thing runs end-to-end.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 max-w-md">
              <Pad k="01" v="Pick a scenario" />
              <Pad k="02" v="Snap a photo" />
              <Pad k="03" v="Get a fair value" />
              <Pad k="04" v="Share the report" />
            </div>
          </div>

          <div className="hidden lg:block h-72 w-px bg-line-strong" />

          <div className="flex justify-center">
            <PhoneFrame label={`snap · ${screen}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {screen === "list" && (
                    <CaseList
                      cases={cases}
                      onPick={(id) => {
                        setCaseId(id);
                        setScreen("detail");
                      }}
                    />
                  )}
                  {screen === "detail" && c && (
                    <CaseDetail c={c} onBack={() => setScreen("list")} onAssess={() => setScreen("capture")} />
                  )}
                  {screen === "capture" && c && (
                    <Capture c={c} onBack={() => setScreen("detail")} onCapture={(blob) => runAssessment(c.id, blob)} />
                  )}
                  {screen === "analyzing" && <Analyzing done={analyzeDone} />}
                  {screen === "assessment" && ax && (
                    <Assessment ax={ax} onBack={() => setScreen("detail")} onStart={() => setScreen(ax.repairSteps.length ? "guide" : "report")} />
                  )}
                  {screen === "guide" && ax && (
                    <GuidedFix ax={ax} onBack={() => setScreen("assessment")} onDone={() => setScreen("report")} />
                  )}
                  {screen === "report" && c && ax && (
                    <Report
                      c={c}
                      ax={ax}
                      onClose={() => {
                        setScreen("list");
                        setCaseId(null);
                        setAx(null);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pad({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper px-3 py-3">
      <div className="font-mono text-[10px] text-ink-dim">{k}</div>
      <div className="text-sm mt-0.5 font-medium">{v}</div>
    </div>
  );
}
