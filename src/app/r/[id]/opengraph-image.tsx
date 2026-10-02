import { ImageResponse } from "next/og";
import { GenericCard, OG_SIZE, ResultCard, loadCardFonts } from "@/lib/card";
import { findSubmission, loadSubmissions } from "@/lib/store";

export const runtime = "nodejs";
export const alt = "ヒカマーズ8values 診断結果";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subs = await loadSubmissions();
  const sub = findSubmission(subs, id);
  const fonts = await loadCardFonts();
  return new ImageResponse(sub ? ResultCard({ sub }) : GenericCard(), { ...OG_SIZE, fonts });
}
