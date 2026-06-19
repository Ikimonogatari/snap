import type { Case, Assessment, ServiceReport, FleetStats } from "./types";

const BASE = "/api";

export async function getCases(industry?: string): Promise<Case[]> {
  const url = industry ? `${BASE}/cases?industry=${industry}` : `${BASE}/cases`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load cases");
  return r.json();
}

export async function getCase(id: string): Promise<Case> {
  const r = await fetch(`${BASE}/cases/${id}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Case not found");
  return r.json();
}

export async function getStats(): Promise<FleetStats> {
  const r = await fetch(`${BASE}/cases/stats`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load stats");
  return r.json();
}

export async function assess(caseId: string, description: string, photo?: File): Promise<Assessment> {
  const form = new FormData();
  form.append("description", description);
  if (photo) form.append("photo", photo);
  const r = await fetch(`${BASE}/assess/${caseId}`, { method: "POST", body: form });
  if (!r.ok) throw new Error("Assessment failed");
  return r.json();
}

export async function finalizeReport(caseId: string, report: Partial<ServiceReport>): Promise<ServiceReport> {
  const r = await fetch(`${BASE}/reports/${caseId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  if (!r.ok) throw new Error("Report failed");
  return r.json();
}

export async function getHealth() {
  const r = await fetch(`${BASE}/health`, { cache: "no-store" });
  return r.json();
}
