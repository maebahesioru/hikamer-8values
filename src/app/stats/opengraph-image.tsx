import { ImageResponse } from "next/og";
import { OG_SIZE, StatsCard, loadCardFonts } from "@/lib/card";
import { computeStats, loadSubmissions } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "ヒカマーズ8values みんなの結果";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const subs = await loadSubmissions();
  const stats = computeStats(subs);
  const fonts = await loadCardFonts();
  return new ImageResponse(StatsCard({ stats }), { ...OG_SIZE, fonts });
}
