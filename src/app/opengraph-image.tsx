import { ImageResponse } from "next/og";
import { GenericCard, OG_SIZE, loadCardFonts } from "@/lib/card";

export const runtime = "nodejs";
export const alt = "ヒカマーズ8values｜ヒカマニ思想診断";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadCardFonts();
  return new ImageResponse(GenericCard(), { ...OG_SIZE, fonts });
}
