import { ImageResponse } from "next/og";
import { CompareCard, GenericCard, OG_SIZE, loadCardFonts } from "@/lib/card";
import { computeCompare } from "@/lib/compare";
import { findSubmission, loadSubmissions } from "@/lib/store";

export const runtime = "nodejs";
export const alt = "ヒカマーズ8values 思想相性診断";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ a: string; b: string }> }) {
  const { a, b } = await params;
  const subs = await loadSubmissions();
  const sa = findSubmission(subs, a);
  const sb = findSubmission(subs, b);
  const fonts = await loadCardFonts();
  if (!sa || !sb) {
    return new ImageResponse(GenericCard(), { ...OG_SIZE, fonts });
  }
  return new ImageResponse(CompareCard({ a: sa, b: sb, cmp: computeCompare(sa, sb) }), {
    ...OG_SIZE,
    fonts,
  });
}
