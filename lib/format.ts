import type { Industry, Severity, VerdictDecision } from "./types";

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export function money(amount: number, currency: "USD" | "MNT" = "USD") {
  if (currency === "MNT") {
    return `₮${amount.toLocaleString("en-US")}`;
  }
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function timeShort(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function severityClasses(s: Severity) {
  switch (s) {
    case "critical": return "text-amber border-amber/40 bg-amber/10";
    case "high":     return "text-amber border-amber/30 bg-amber/5";
    case "medium":   return "text-lime border-lime/30 bg-lime/5";
    default:         return "text-ink-muted border-line bg-white/5";
  }
}

export function verdictLabel(v: VerdictDecision) {
  return v === "repair" ? "Repair" : v === "replace" ? "Replace" : "Total loss";
}

export function verdictColor(v: VerdictDecision) {
  return v === "repair"
    ? "text-lime border-lime/40 bg-lime/10"
    : v === "replace"
    ? "text-amber border-amber/40 bg-amber/10"
    : "text-ink border-line-strong bg-white/5";
}

export function industryLabel(i: Industry): string {
  return ({
    telecom: "Telecom",
    insurance: "Insurance",
    property: "Property",
    manufacturing: "Manufacturing",
    it: "IT",
  } as Record<Industry, string>)[i];
}
