import { cases } from "@/lib/server/data/seed";
import { assessWithClaude } from "@/lib/server/ai/assess";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const c = cases.find((x) => x.id === id);
  if (!c) return Response.json({ error: "Case not found" }, { status: 404 });

  let description = c.reportedIssue;
  let imageBase64: string | undefined;
  let imageMediaType: "image/jpeg" | "image/png" | "image/webp" | undefined;

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const desc = form.get("description");
    if (typeof desc === "string" && desc.trim().length) description = desc;
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const buf = Buffer.from(await photo.arrayBuffer());
      imageBase64 = buf.toString("base64");
      const mt = photo.type;
      if (mt === "image/jpeg" || mt === "image/png" || mt === "image/webp") imageMediaType = mt;
    }
  }

  const assessment = await assessWithClaude({
    industry: c.industry,
    asset: c.asset,
    description,
    imageBase64,
    imageMediaType,
  });

  c.assessment = assessment;
  c.status = "resolving";

  return Response.json(assessment);
}
