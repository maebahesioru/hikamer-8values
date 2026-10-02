import Link from "next/link";
import type { Metadata } from "next";
import { AXES, topAxes, type Scores } from "@/lib/scoring";
import { IDEOLOGIES } from "@/data/results";
import { QUESTIONS } from "@/data/questions";
import { GAUGE_ORDER } from "@/lib/axis-ui";
import { findSubmission, fmtTs, loadSubmissions } from "@/lib/store";
import ShareButtons from "@/components/ShareButtons";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "あの人の結果｜ヒカマーズ8values",
  description: "匿名で投稿されたヒカマニ思想診断の結果ページです。",
};

export default async function PersonResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const subs = await loadSubmissions();
  const sub = findSubmission(subs, id);

  if (!sub) {
    return (
      <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8 text-center">
        <h1 className="mb-4 mt-24 text-xl font-black">この結果は見つかりませんでした</h1>
        <p className="mb-10 text-sm text-mut">まだ集計されていないか、URLが違う可能性があります。</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/stats"
            className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
          >
            みんなの結果へ
          </Link>
          <Link
            href="/quiz?start=1"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            自分も診断する
          </Link>
        </div>
      </main>
    );
  }

  const ideology = IDEOLOGIES.find((i) => i.id === sub.t);
  const scores = Object.fromEntries(AXES.map((ax, i) => [ax, sub.s[i]])) as Scores;
  const top = topAxes(scores, 3);
  const strongAgree = QUESTIONS.map((q, i) => ({ q, a: sub.a[i] }))
    .filter((x) => x.a === 2)
    .slice(0, 4);
  const strongDisagree = QUESTIONS.map((q, i) => ({ q, a: sub.a[i] }))
    .filter((x) => x.a === -2)
    .slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8">
      <div className="mb-4 flex items-center justify-between text-sm text-mut">
        <Link href="/stats" className="transition hover:text-foreground">
          ← みんなの結果へ
        </Link>
        <span className="tabular-nums">
          {fmtTs(sub.ts)}・#{sub.id.slice(0, 6)}
        </span>
      </div>

      <p className="mb-2 text-center text-xs font-bold tracking-[0.3em] text-accent">ANOTHER RESULT</p>
      <h1 className="mb-8 text-center text-2xl font-black md:text-3xl">
        {sub.n ? `${sub.n}のヒカマニ思想` : "あの人のヒカマニ思想"}
      </h1>

      <div className="mb-6 rounded-2xl border border-accent/40 bg-panel p-6 text-center md:p-10">
        {ideology?.tags && <div className="mb-2 text-lg tracking-widest">{ideology.tags}</div>}
        <h2 className="mb-3 text-3xl font-black text-accent md:text-4xl">{ideology?.name ?? sub.t}</h2>
        {ideology?.desc && (
          <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-foreground/90">{ideology.desc}</p>
        )}
        {ideology?.flavor && <p className="mb-4 text-xs text-mut">{ideology.flavor}</p>}
        <p className="text-xs text-mut">一致度 {sub.m}%</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-mut">強い傾向:</span>
          {top.map((x) => (
            <span key={x.label} className="rounded-full border border-line bg-panel2 px-3 py-1 text-xs">
              {x.label} <span className="font-bold tabular-nums text-accent">{x.value}</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
        <h2 className="mb-5 text-sm font-bold tracking-widest text-mut">9つの軸（18の価値）</h2>
        <div className="flex flex-col gap-4">
          {AXES.map((axis, i) => {
            const o = GAUGE_ORDER[axis];
            const v = sub.s[i];
            const leftPct = o.leftIsPlus ? v : 100 - v;
            return (
              <div key={axis}>
                <div className="mb-1.5 flex items-end justify-between gap-2 text-sm">
                  <span className="whitespace-nowrap font-bold">
                    {o.left} <span className="tabular-nums">{leftPct}</span>
                  </span>
                  <span className="whitespace-nowrap font-bold text-mut">
                    {o.right} <span className="tabular-nums">{100 - leftPct}</span>
                  </span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-panel2">
                  <div style={{ width: `${Math.max(leftPct, 1.5)}%`, background: o.color }} />
                  <div className="grow" style={{ background: "#1a2333" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {(strongAgree.length > 0 || strongDisagree.length > 0) && (
        <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
          <h2 className="mb-6 text-sm font-bold tracking-widest text-mut">この人の主張ポイント</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-xs font-bold tracking-widest text-accent2">強く「賛成」した設問</h3>
              <ul className="flex flex-col gap-3">
                {strongAgree.length === 0 && <li className="text-xs text-mut">なし（全部おだやか）</li>}
                {strongAgree.map((x) => (
                  <li
                    key={x.q.id}
                    className="rounded-xl border border-line bg-panel2 p-3 text-xs leading-relaxed"
                  >
                    <span className="mr-2 font-bold text-mut">Q{x.q.id}</span>
                    {x.q.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-bold tracking-widest text-danger">強く「反対」した設問</h3>
              <ul className="flex flex-col gap-3">
                {strongDisagree.length === 0 && <li className="text-xs text-mut">なし（全部おだやか）</li>}
                {strongDisagree.map((x) => (
                  <li
                    key={x.q.id}
                    className="rounded-xl border border-line bg-panel2 p-3 text-xs leading-relaxed"
                  >
                    <span className="mr-2 font-bold text-mut">Q{x.q.id}</span>
                    {x.q.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="mb-8">
        <ShareButtons
          text={`【ヒカマーズ8values】\n${sub.n ?? "とあるヒカマー"}のヒカマニ思想は「${ideology?.name ?? sub.t}」(一致度${sub.m}%)でした。\nあなたも診断してみて。`}
          url={`${SITE_URL}/r/${sub.id}`}
          imageUrl={`/r/${sub.id}/opengraph-image`}
          imageName={`hikamer8values-${sub.id}.png`}
        />
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-3">
        <Link
          href={`/compare?a=${sub.id}`}
          className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
        >
          この人と比較する
        </Link>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/quiz?start=1"
          className="rounded-xl bg-accent px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
        >
          自分も診断する
        </Link>
        <Link
          href="/stats"
          className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
        >
          みんなの結果を見る
        </Link>
      </div>

      <p className="text-center text-xs leading-relaxed text-mut">
        ※この結果は匿名（ランダムIDのみ）で投稿されたものです。個人を特定する情報は含まれていません。
        <br />
        結果はネタです。誰かを攻撃するためのものではありません。
      </p>
    </main>
  );
}
