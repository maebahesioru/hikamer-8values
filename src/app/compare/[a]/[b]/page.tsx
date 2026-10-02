import Link from "next/link";
import type { Metadata } from "next";
import { IDEOLOGIES } from "@/data/results";
import { GAUGE_ORDER } from "@/lib/axis-ui";
import { computeCompare, simTier } from "@/lib/compare";
import { findSubmission, loadSubmissions } from "@/lib/store";
import ShareButtons from "@/components/ShareButtons";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ a: string; b: string }>;
}): Promise<Metadata> {
  const { a, b } = await params;
  const subs = await loadSubmissions();
  const sa = findSubmission(subs, a);
  const sb = findSubmission(subs, b);
  const nameA = sa?.n ?? "匿名";
  const nameB = sb?.n ?? "匿名";
  return {
    title: `${nameA} × ${nameB} の相性｜ヒカマーズ8values`,
    description: "2人のヒカマニ思想の相性を9軸で比較した結果です。",
  };
}

export default async function CompareResultPage({
  params,
}: {
  params: Promise<{ a: string; b: string }>;
}) {
  const { a, b } = await params;
  const subs = await loadSubmissions();
  const sa = findSubmission(subs, a);
  const sb = findSubmission(subs, b);

  if (!sa || !sb) {
    return (
      <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8 text-center">
        <h1 className="mb-4 mt-24 text-xl font-black">比較できない組み合わせです</h1>
        <p className="mb-10 text-sm text-mut">片方または両方の結果が見つかりませんでした。</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/compare"
            className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
          >
            選び直す
          </Link>
          <Link
            href="/stats"
            className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
          >
            みんなの結果へ
          </Link>
        </div>
      </main>
    );
  }

  const cmp = computeCompare(sa, sb);
  const tier = simTier(cmp.sim);
  const ideoA = IDEOLOGIES.find((i) => i.id === sa.t);
  const ideoB = IDEOLOGIES.find((i) => i.id === sb.t);
  const nameA = sa.n ?? "匿名";
  const nameB = sb.n ?? "匿名";
  const A_COLOR = "#1d9bf0";
  const B_COLOR = "#ff2e88";
  const leftPct = (o: (typeof GAUGE_ORDER)[keyof typeof GAUGE_ORDER], v: number) =>
    o.leftIsPlus ? v : 100 - v;

  return (
    <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8">
      <div className="mb-4 flex items-center justify-between text-sm text-mut">
        <Link href="/compare" className="transition hover:text-foreground">
          ← 選び直す
        </Link>
        <Link href="/stats" className="transition hover:text-foreground">
          みんなの結果へ
        </Link>
      </div>

      <p className="mb-2 text-center text-xs font-bold tracking-[0.3em] text-accent">VERSUS</p>
      <h1 className="mb-8 text-center text-2xl font-black md:text-3xl">
        <span style={{ color: A_COLOR }}>{nameA}</span>
        <span className="mx-2 text-mut">×</span>
        <span style={{ color: B_COLOR }}>{nameB}</span>
      </h1>

      {/* スコアカード */}
      <div className="mb-6 rounded-2xl border border-accent/40 bg-panel p-6 text-center md:p-10">
        <p className="mb-2 text-xs font-bold tracking-widest text-mut">思想相性</p>
        <p className="mb-3 text-6xl font-black text-accent md:text-7xl">{cmp.sim}%</p>
        <p className="mb-4 text-lg font-black text-amber">{tier.label}</p>
        <p className="mx-auto max-w-xl text-xs leading-relaxed text-mut">
          9軸スコアの平均的な近さ（100 − 平均差）。同じ方向に強い2人ほど高くなります。
        </p>
      </div>

      {/* 2人のカード */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Link
          href={`/r/${sa.id}`}
          className="rounded-2xl border border-line bg-panel p-5 transition hover:border-accent"
        >
          <p className="mb-1 text-xs font-bold" style={{ color: A_COLOR }}>
            {nameA}
          </p>
          <p className="mb-1 text-lg font-black">{ideoA?.name ?? sa.t}</p>
          <p className="text-xs text-mut">一致度 {sa.m}%</p>
        </Link>
        <Link
          href={`/r/${sb.id}`}
          className="rounded-2xl border border-line bg-panel p-5 transition hover:border-accent"
        >
          <p className="mb-1 text-xs font-bold" style={{ color: B_COLOR }}>
            {nameB}
          </p>
          <p className="mb-1 text-lg font-black">{ideoB?.name ?? sb.t}</p>
          <p className="text-xs text-mut">一致度 {sb.m}%</p>
        </Link>
      </div>

      {/* 軸ごとの比較 */}
      <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
        <h2 className="mb-1 text-sm font-bold tracking-widest text-mut">軸ごとの比較</h2>
        <p className="mb-6 text-xs">
          <span style={{ color: A_COLOR }}>●</span> {nameA}　
          <span style={{ color: B_COLOR }}>●</span> {nameB}
        </p>
        <div className="flex flex-col gap-5">
          {cmp.rows.map((r) => {
            const o = GAUGE_ORDER[r.axis];
            const la = leftPct(o, r.va);
            const lb = leftPct(o, r.vb);
            return (
              <div key={r.axis}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-bold">
                    <span style={{ color: o.color }}>{o.left}</span>
                    <span className="mx-1 text-mut">↔</span>
                    {o.right}
                  </span>
                  <span className="tabular-nums text-mut">
                    {nameA} {la}%・{nameB} {lb}%・差 {r.diff}
                  </span>
                </div>
                <div className="relative h-3.5 rounded-full bg-panel2">
                  <div
                    className="absolute top-0 h-full w-1.5 rounded-full"
                    style={{ left: `calc(${la}% - 3px)`, background: A_COLOR }}
                  />
                  <div
                    className="absolute top-0 h-full w-1.5 rounded-full"
                    style={{ left: `calc(${lb}% - 3px)`, background: B_COLOR }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 一致・真逆 */}
      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="mb-4 text-xs font-bold tracking-widest text-accent2">一致している軸 TOP3</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {cmp.agreeTop.map((d) => {
              const o = GAUGE_ORDER[d.axis];
              return (
                <li key={d.axis} className="flex items-center justify-between rounded-xl border border-line bg-panel2 px-4 py-2.5">
                  <span className="font-bold">{o.left} ↔ {o.right}</span>
                  <span className="tabular-nums text-xs text-mut">差 {d.diff}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-6">
          <h2 className="mb-4 text-xs font-bold tracking-widest text-amber">真逆な軸 TOP3</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {cmp.diffTop.map((d) => {
              const o = GAUGE_ORDER[d.axis];
              return (
                <li key={d.axis} className="flex items-center justify-between rounded-xl border border-line bg-panel2 px-4 py-2.5">
                  <span className="font-bold">{o.left} ↔ {o.right}</span>
                  <span className="tabular-nums text-xs text-mut">差 {d.diff}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="mb-8">
        <ShareButtons
          text={`【ヒカマーズ8values】${nameA} × ${nameB} の思想相性は ${cmp.sim}%でした（${tier.label}）。`}
          url={`${SITE_URL}/compare/${sa.id}/${sb.id}`}
          imageUrl={`/compare/${sa.id}/${sb.id}/opengraph-image`}
          imageName={`hikamer8values-compare-${sa.id}-${sb.id}.png`}
        />
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/compare"
          className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
        >
          他の組み合わせを見る
        </Link>
        <Link
          href="/quiz?start=1"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
        >
          自分も診断する
        </Link>
      </div>

      <p className="text-center text-xs leading-relaxed text-mut">
        ※結果は匿名（ランダムIDのみ）で投稿されたデータの比較です。ネタとしてお楽しみください。
      </p>
    </main>
  );
}
