"use client";

import { useState } from "react";

/** Xシェア＋リンクコピー＋（任意）画像保存（サーバーページからも使えるクライアント部品） */
export default function ShareButtons({
  text,
  url,
  imageUrl,
  imageName,
}: {
  text: string;
  url: string;
  imageUrl?: string;
  imageName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={intent}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:opacity-85"
      >
        Xでシェア
      </a>
      <button
        onClick={copy}
        className="rounded-xl border border-line bg-panel px-5 py-2.5 text-sm font-bold transition hover:border-accent"
      >
        {copied ? "コピーしました" : "リンクをコピー"}
      </button>
      {imageUrl && (
        <a
          href={imageUrl}
          download={imageName ?? "hikamer8values.png"}
          className="rounded-xl border border-line bg-panel px-5 py-2.5 text-sm font-bold transition hover:border-accent"
        >
          画像で保存
        </a>
      )}
    </div>
  );
}
