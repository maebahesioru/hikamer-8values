import Link from "next/link";
import type { Metadata } from "next";
import { AXES } from "@/lib/scoring";
import { IDEOLOGIES } from "@/data/results";
import { QUESTIONS } from "@/data/questions";
import { GAUGE_ORDER } from "@/lib/axis-ui";
import { computeStats, fmtTs, loadSubmissions } from "@/lib/store";
import ShareButtons from "@/components/ShareButtons";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "みんなの結果｜ヒカマーズ8values",
  description:
    "ヒカマーズ8valuesの匿名集計ページ。9軸の平均・タイプ分布・設問別の賛否がわかります。",
};

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

export default async function StatsPage() {
  const subs = await loadSubmissions();
  const stats = computeStats(subs);
  const t = stats.total;
  const nameById = new Map(IDEOLOGIES.map((i) => [i.id, i]));

  return (
    <main className="mx-auto w-full max-w-4xl grow px-4 pb-24 pt-8">
      <div className="mb-4 flex items-center justify-between text-sm text-mut">
        <Link href="/" className="transition hover:text-foreground">
          ← トップへ
        </Link>
        <span className="tabular-nums">{t} 件の回答</span>
      </div>

      <p className="mb-2 text-center text-xs font-bold tracking-[0.3em] text-accent">AGGREGATE</p>
      <h1 className="mb-2 text-center text-2xl font-black md:text-3xl">みんなの結果</h1>
      <p className="mb-10 text-center text-xs text-mut">
        匿名のランダムIDで自動集計しています（1端末=1票・最新の回答）。表示名は入力した人だけ表示されます。
      </p>

      {t === 0 ? (
        <div className="rounded-2xl border border-line bg-panel p-10 text-center">
          <p className="mb-6 text-sm text-mut">まだ回答がありません。</p>
          <Link
            href="/quiz?start=1"
            className="inline-block rounded-xl bg-accent px-8 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            最初の1人になる
          </Link>
        </div>
      ) : (
        <>
          <section className="mb-8 rounded-2xl border border-accent/40 bg-panel p-6 md:p-8">
            <h2 className="mb-5 text-sm font-bold tracking-widest text-mut">界隈の平均プロファイル</h2>
            {stats.avgNearest && (
              <p className="mb-6 text-center text-base md:text-lg">
                平均に最も近いのは{" "}
                <span className="text-xl font-black text-accent md:text-2xl">{stats.avgNearest.name}</span>
                <span className="ml-2 whitespace-nowrap text-xs text-mut">
                  一致度 {stats.avgNearest.match}%
                </span>
              </p>
            )}
            <div className="flex flex-col gap-4">
              {AXES.map((axis, i) => {
                const o = GAUGE_ORDER[axis];
                const v = stats.axisAvg[i];
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

          <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
            <h2 className="mb-5 text-sm font-bold tracking-widest text-mut">
              タイプ分布（{stats.typeCounts.length} 種出現 / 全52種）
            </h2>
            <div className="flex flex-col gap-2">
              {stats.typeCounts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 truncate font-bold md:w-56">{c.name}</span>
                  <div className="h-4 grow overflow-hidden rounded bg-panel2">
                    <div className="h-full bg-accent" style={{ width: `${Math.max(pct(c.count, t), 2)}%` }} />
                  </div>
                  <span className="w-24 shrink-0 text-right tabular-nums text-mut">
                    {c.count}人・{pct(c.count, t)}%
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
            <h2 className="mb-2 text-sm font-bold tracking-widest text-mut">設問別の回答分布</h2>
            <p className="mb-5 text-xs text-mut">みんなが賛成している設問・界隈で割れている設問がわかります。</p>
            <div className="flex flex-col gap-4">
              {QUESTIONS.map((q, i) => {
                const d = stats.qDist[i];
                const pP = pct(d.p, t);
                const zP = pct(d.z, t);
                const nP = Math.max(0, 100 - pP - zP);
                return (
                  <div key={q.id}>
                    <p className="mb-1 text-xs leading-relaxed text-foreground/90">
                      <span className="mr-2 font-bold text-mut">Q{q.id}</span>
                      {q.text}
                    </p>
                    <div className="flex h-3.5 overflow-hidden rounded-full bg-panel2">
                      <div style={{ width: `${pP}%`, background: "#1d9bf0" }} />
                      <div style={{ width: `${zP}%`, background: "#3a4657" }} />
                      <div className="grow" style={{ background: "#ff6b6b" }} />
                    </div>
                    <p className="mt-0.5 flex gap-4 text-[11px] tabular-nums text-mut">
                      <span>賛成 {pP}%</span>
                      <span>どちらでもない {zP}%</span>
                      <span>反対 {nP}%</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
            <h2 className="mb-5 text-sm font-bold tracking-widest text-mut">最近の診断（新しい順）</h2>
            {stats.recent.length === 0 ? (
              <p className="text-sm text-mut">まだありません。</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {stats.recent.map((r) => (
                  <li key={`${r.id}-${r.ts}`}>
                    <Link
                      href={`/r/${r.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-panel2 px-4 py-2.5 text-sm transition hover:border-accent"
                    >
                      <span className="truncate">
                        <span className="font-bold">{r.n ?? "匿名"}</span>
                        <span className="ml-2 text-xs text-mut">{nameById.get(r.t)?.name ?? r.t}</span>
                      </span>
                      <span className="shrink-0 text-xs text-mut">
                        一致度 {r.m}%・{fmtTs(r.ts)}・#{r.id.slice(0, 6)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-[11px] leading-relaxed text-mut">
              行をタップすると、その人の結果ページ（あの人はこんな感じ）が見られます。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-line bg-panel p-6 text-center md:p-8">
            <h2 className="mb-2 text-sm font-bold tracking-widest text-mut">相性診断</h2>
            <p className="mb-5 text-sm leading-relaxed">気になる2人を選んで、思想の相性を見てみよう。</p>
            <Link
              href="/compare"
              className="inline-block rounded-xl bg-accent px-8 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              2人の相性を見る →
            </Link>
          </section>

          <div className="mb-8">
            <ShareButtons
              text={`【ヒカマーズ8values】みんなの結果（${t}件）公開中。平均に最も近いのは「${stats.avgNearest?.name ?? ""}」。`}
              url={`${SITE_URL}/stats`}
              imageUrl="/stats/opengraph-image"
              imageName="hikamer8values-stats.png"
            />
          </div>

          <p className="mb-8 text-center text-xs leading-relaxed text-mut">
            回答と結果は匿名（ランダムIDのみ）で記録されています。個人を特定する情報は収集していません。
            <br />
            結果はネタです。誰かを攻撃するためのものではありません。
          </p>
          <div className="text-center">
            <Link
              href="/quiz?start=1"
              className="inline-block rounded-xl bg-accent px-8 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              自分も診断する
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
