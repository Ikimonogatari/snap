import { cases } from "@/lib/server/data/seed";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = cases.find((x) => x.id === id);
  if (!c) return Response.json({ error: "Case not found" }, { status: 404 });
  return Response.json(c);
}
