import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ヒカマーズ8values｜ヒカマニ思想診断",
  description:
    "全70問・9つの軸・52タイプで、あなたのヒカマニ思想を診断。ヒカマーズグラフ・ヒカマーズ思想（@Hiwai_7）とヒカマーwikiの思想・勢力分類を元ネタにしたファン診断サイト。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${noto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
