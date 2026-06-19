import { fleetStats } from "@/lib/server/data/seed";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(fleetStats);
}
