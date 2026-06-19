"use client";

import { Zap } from "lucide-react";

const items = [
  "VRD-7842 · MBP 14\" display crack → repair · $180",
  "VRD-7843 · PickPack cabinet L3 → repair · $38",
  "VRD-7844 · Land Cruiser bumper → repair · $640",
  "VRD-7845 · Ceiling water damage → repair · $320",
  "VRD-7846 · Grundfos pump housing → replace · $2,400",
  "VRD-7847 · Huawei ONU LOS → escalate · NOC",
];

export function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-surface/40">
      <div className="flex marquee-track">
        {[...items, ...items].map((s, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted"
          >
            <Zap size={11} className="text-lime" />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
