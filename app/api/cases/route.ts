import type { NextRequest } from "next/server";
import { cases } from "@/lib/server/data/seed";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const industry = req.nextUrl.searchParams.get("industry");
  const filtered = industry ? cases.filter((c) => c.industry === industry) : cases;
  return Response.json(filtered);
}
