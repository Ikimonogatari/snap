export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "snap-api",
    ai: process.env.ANTHROPIC_API_KEY ? "live (claude-opus-4-7)" : "scripted-fallback",
    time: new Date().toISOString(),
  });
}
