import { cases } from "@/lib/server/data/seed";
import type { ServiceReport } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = cases.find((x) => x.id === id);
  if (!c) return Response.json({ error: "Case not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as Partial<ServiceReport>;
  const verdict = c.assessment?.verdict.decision;
  const finalVerdict: ServiceReport["finalVerdict"] =
    verdict === "repair" ? "repaired" : verdict === "replace" ? "replaced" : "written_off";

  const report: ServiceReport = {
    resolvedIssue: body.resolvedIssue ?? c.assessment?.damages[0]?.type ?? "Resolved",
    partsUsed: body.partsUsed ?? c.assessment?.partsNeeded ?? [],
    timeSpentMinutes: body.timeSpentMinutes ?? c.assessment?.verdict.estimatedTimeMinutes ?? 30,
    finalVerdict: body.finalVerdict ?? finalVerdict,
    notes: body.notes ?? "Closed via Verdict guided workflow.",
    closedAt: new Date().toISOString(),
  };

  c.report = report;
  c.status = "done";
  return Response.json(report);
}
