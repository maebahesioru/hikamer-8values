import Link from "next/link";
import type { Metadata } from "next";
import { IDEOLOGIES } from "@/data/results";
import { latestPerClient, loadSubmissions, fmtTs } from "@/lib/store";
import ComparePicker, { type PickItem } from "@/components/ComparePicker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "相性診断｜ヒカマーズ8values",
  description: "2人の診断結果を選んで、9軸の思想相性を見てみよう。",
};

export default async function CompareSelectPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const { a } = await searchParams;
  const subs = await loadSubmissions();
  const latest = latestPerClient(subs).sort((x, y) => y.ts - x.ts).slice(0, 300);
  const nameOf = new Map(IDEOLOGIES.map((i) => [i.id, i.name]));
  const items: PickItem[] = latest.map((s) => ({
    id: s.id,
    label: `${s.n ?? "匿名"}｜${nameOf.get(s.t) ?? s.t}（${fmtTs(s.ts)}）`,
  }));

  return (
    <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8">
      <div className="mb-4 flex items-center justify-between text-sm text-mut">
        <Link href="/stats" className="transition hover:text-foreground">
          ← みんなの結果へ
        </Link>
        <span className="tabular-nums">{latest.length} 人から選択</span>
      </div>

      <p className="mb-2 text-center text-xs font-bold tracking-[0.3em] text-accent">VERSUS</p>
      <h1 className="mb-2 text-center text-2xl font-black md:text-3xl">相性診断</h1>
      <p className="mb-10 text-center text-xs text-mut">
        直近の回答（最大300人）から2人を選んで、思想の相性を見られます。
      </p>

      {items.length < 2 ? (
        <div className="rounded-2xl border border-line bg-panel p-10 text-center">
          <p className="mb-6 text-sm text-mut">
           まだ比較できるだけの結果がありません（現在 {items.length} 人）。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/quiz?start=1"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              自分が診断する
            </Link>
            <Link
              href="/stats"
              className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
            >
              みんなの結果へ
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-panel p-6 md:p-8">
          <ComparePicker items={items} presetA={a} />
        </div>
      )}
    </main>
  );
}
