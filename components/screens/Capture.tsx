"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, Zap, RefreshCw, Camera, ImageIcon, AlertTriangle } from "lucide-react";
import type { Case } from "@/lib/types";

type CamState = "idle" | "starting" | "live" | "denied" | "unavailable";

export function Capture({
  c,
  onBack,
  onCapture,
}: {
  c: Case;
  onBack: () => void;
  onCapture: (blob: Blob | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camState, setCamState] = useState<CamState>("idle");
  const [facing, setFacing] = useState<"user" | "environment">("environment");

  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setCamState("unavailable");
        return;
      }
      setCamState("starting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCamState("live");
      } catch (err) {
        const e = err as DOMException;
        if (e?.name === "NotAllowedError") setCamState("denied");
        else setCamState("unavailable");
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [facing]);

  function shoot() {
    const video = videoRef.current;
    if (!video || camState !== "live") {
      onCapture(null);
      return;
    }
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 1280;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onCapture(null);
      return;
    }
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => onCapture(blob), "image/jpeg", 0.85);
  }

  return (
    <div className="relative h-full text-paper bg-navy">
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${camState === "live" ? "opacity-100" : "opacity-0"}`}
        style={{ transform: facing === "user" ? "scaleX(-1)" : "none" }}
      />
      <canvas ref={canvasRef} className="hidden" />

      {camState !== "live" && (
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1a2230, #0c1626 50%, #050810)" }} />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/0 to-black/60 pointer-events-none" />

      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 pointer-events-none"
      >
        <Corner className="top-0 left-0" />
        <Corner className="top-0 right-0 rotate-90" />
        <Corner className="bottom-0 right-0 rotate-180" />
        <Corner className="bottom-0 left-0 -rotate-90" />
        <div className="absolute inset-6 rounded-full border border-coral/30" />
      </motion.div>

      <div className="absolute top-0 inset-x-0 pt-12 px-5 flex items-center justify-between z-10">
        <button onClick={onBack} className="h-9 w-9 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center">
          <ArrowLeft size={14} />
        </button>
        <StatusBadge state={camState} />
        <button
          onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
          className="h-9 w-9 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center"
          title="Switch camera"
        >
          <Zap size={14} />
        </button>
      </div>

      {camState === "denied" && <DeniedOverlay onUseSample={() => onCapture(null)} />}
      {camState === "unavailable" && <UnavailableOverlay onUseSample={() => onCapture(null)} />}

      {(camState === "live" || camState === "starting") && (
        <div className="absolute left-5 right-5 bottom-28 z-10">
          <div className="rounded-2xl bg-black/60 backdrop-blur border border-white/10 px-4 py-3 flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-coral/20 border border-coral/40 flex items-center justify-center">
              <Mic size={12} className="text-coral" />
            </div>
            <div className="flex-1">
              <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-paper/70">
                listening · mn / en
              </div>
              <div className="mt-1 text-[13px] leading-snug text-paper">
                "{c.reportedIssue.slice(0, 90)}{c.reportedIssue.length > 90 ? "..." : ""}"
                <span className="caret ml-0.5">|</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute left-0 right-0 bottom-6 flex items-center justify-around px-10 z-10">
        <button
          onClick={() => onCapture(null)}
          title="Use sample image"
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center"
        >
          <ImageIcon size={14} />
        </button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={shoot}
          className="relative h-16 w-16 rounded-full bg-coral ring-4 ring-coral/30 flex items-center justify-center glow-coral"
        >
          <Camera size={22} className="text-paper" />
        </motion.button>
        <button
          onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center"
          title="Switch camera"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ state }: { state: CamState }) {
  const map = {
    idle: { label: "snap · idle", color: "text-paper/70" },
    starting: { label: "snap · starting", color: "text-paper/70" },
    live: { label: "snap · live", color: "text-coral" },
    denied: { label: "snap · permission denied", color: "text-yellow-300" },
    unavailable: { label: "snap · no camera", color: "text-yellow-300" },
  } as const;
  const m = map[state];
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/10 font-mono text-[10px] uppercase tracking-[0.22em] ${m.color}`}>
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="pulse-dot absolute inset-0" />
        <span className="relative h-full w-full rounded-full bg-current" />
      </span>
      {m.label}
    </div>
  );
}

function DeniedOverlay({ onUseSample }: { onUseSample: () => void }) {
  return (
    <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-2xl bg-black/70 backdrop-blur border border-coral/40 p-4 z-20">
      <div className="flex items-center gap-2 text-coral font-mono text-[10px] uppercase tracking-[0.22em]">
        <AlertTriangle size={12} /> camera permission denied
      </div>
      <p className="mt-2 text-[12px] text-paper leading-relaxed">
        Allow camera in your browser, or continue with the bundled sample image — the
        assessment still runs end-to-end.
      </p>
      <button onClick={onUseSample} className="mt-3 w-full rounded-full bg-coral text-paper font-medium py-2 text-sm">
        Use sample image
      </button>
    </div>
  );
}

function UnavailableOverlay({ onUseSample }: { onUseSample: () => void }) {
  return (
    <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-2xl bg-black/70 backdrop-blur border border-white/10 p-4 z-20">
      <div className="flex items-center gap-2 text-paper/70 font-mono text-[10px] uppercase tracking-[0.22em]">
        <AlertTriangle size={12} /> no camera detected
      </div>
      <p className="mt-2 text-[12px] text-paper leading-relaxed">Continue with the bundled sample image.</p>
      <button onClick={onUseSample} className="mt-3 w-full rounded-full bg-coral text-paper font-medium py-2 text-sm">
        Use sample image
      </button>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute h-6 w-6 ${className}`}>
      <div className="absolute top-0 left-0 h-full w-[2px] bg-coral" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-coral" />
    </div>
  );
}
