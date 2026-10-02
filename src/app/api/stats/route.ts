import { NextResponse } from "next/server";
import { computeStats, loadSubmissions } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const subs = await loadSubmissions();
  const stats = computeStats(subs);
  return NextResponse.json({ ok: true, ...stats });
}
