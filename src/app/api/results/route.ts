import { NextRequest, NextResponse } from "next/server";
import { appendSubmission, validateAndBuild } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 簡易レート制限（IPごと 30件/分） */
const hits = new Map<string, { at: number; n: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.at > 60_000) {
    hits.set(ip, { at: now, n: 1 });
    return false;
  }
  rec.n++;
  return rec.n > 30;
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }
  const sub = validateAndBuild(body);
  if (!sub) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  try {
    await appendSubmission(sub);
  } catch {
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: sub.id });
}
