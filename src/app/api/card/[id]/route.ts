import { ImageResponse } from "next/og";
import { OG_SIZE, POST_SIZE, ResultCard, loadCardFonts } from "@/lib/card";
import { findSubmission, loadSubmissions } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 結果カードのPNG（?size=post で4:5の投稿用、既定はOG用1200x630） */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subs = await loadSubmissions();
  const sub = findSubmission(subs, id);
  if (!sub) return new Response("Not found", { status: 404 });
  const wide = new URL(req.url).searchParams.get("size") === "post";
  const size = wide ? POST_SIZE : OG_SIZE;
  const fonts = await loadCardFonts();
  return new ImageResponse(ResultCard({ sub, wide }), {
    ...size,
    fonts,
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
