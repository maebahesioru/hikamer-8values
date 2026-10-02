"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import {
  AXIS_META,
  AXES,
  computeScores,
  rankIdeologies,
  daiHikamerSubtype,
  shareText,
  topAxes,
  type Scores,
  type MatchResult,
} from "@/lib/scoring";
import { IDEOLOGIES } from "@/data/results";
import type { Axis } from "@/data/questions";
import { GAUGE_ORDER } from "@/lib/axis-ui";

const OPTIONS: { label: string; value: number }[] = [
  { label: "賛成", value: 2 },
  { label: "どちらかといえば賛成", value: 1 },
  { label: "どちらでもない", value: 0 },
  { label: "どちらかといえば反対", value: -1 },
  { label: "反対", value: -2 },
];

/** 診断の進捗をリロード後も復元するための保存キー */
const STORAGE_KEY = "hikamer8values.progress.v1";

/** 匿名端末ID（結果ページの共有・集計用） */
const CLIENT_KEY = "hikamer8values.client.v1";
const SUBMITTED_KEY = "hikamer8values.submitted.v1";

function getClientId(): string {
  try {
    let v = window.localStorage.getItem(CLIENT_KEY);
    if (!v || !/^[a-z0-9]{6,32}$/.test(v)) {
      const buf = new Uint8Array(6);
      window.crypto.getRandomValues(buf);
      v = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
      window.localStorage.setItem(CLIENT_KEY, v);
    }
    return v;
  } catch {
    return Math.random().toString(16).slice(2, 14);
  }
}

interface SavedProgress {
  v: number;
  idx: number;
  phase: "quiz" | "result";
  answers: (number | null)[];
}

export default function QuizFlow() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(QUESTIONS.length).fill(null),
  );
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");
  const [hydrated, setHydrated] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);

  const total = QUESTIONS.length;

  // 初回ロード: 保存済みの進捗を復元。未開始のまま直接 /quiz に来た場合はトップへ戻す。
  useEffect(() => {
    let restored = false;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedProgress;
        if (
          saved &&
          saved.v === total &&
          Array.isArray(saved.answers) &&
          saved.answers.length === total
        ) {
          const savedAnswers = saved.answers.map((a) =>
            typeof a === "number" && a >= -2 && a <= 2 ? a : null,
          );
          const complete = savedAnswers.every((a) => a !== null);
          setAnswers(savedAnswers);
          if (saved.phase === "result" && complete) {
            setPhase("result");
          } else {
            setPhase("quiz");
            setIdx(Math.min(Math.max(saved.idx || 0, 0), total - 1));
          }
          restored = true;
        }
      }
    } catch {
      /* 壊れた保存データは無視して新規扱い */
    }

    if (!restored) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("start") === "1") {
        // トップの「診断をはじめる」経由: 空の進捗を作って開始
        try {
          const fresh: SavedProgress = {
            v: total,
            idx: 0,
            phase: "quiz",
            answers: Array(total).fill(null),
          };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        } catch {}
        window.history.replaceState(null, "", "/quiz");
      } else {
        // 未開始の直アクセス: トップページへ
        router.replace("/");
        return;
      }
    }
    setHydrated(true);
  }, [router, total]);

  // 進捗を都度保存（リロード・タブ復帰用）
  useEffect(() => {
    if (!hydrated) return;
    try {
      const data: SavedProgress = { v: total, idx, phase, answers };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [hydrated, idx, phase, answers, total]);

  const result = useMemo(() => {
    if (phase !== "result") return null;
    const scores = computeScores(answers.map((a) => a ?? 0));
    const ranked = rankIdeologies(scores);
    return { scores, ranked };
  }, [phase, answers]);

  // 結果確定時に匿名で自動送信（1端末=最新の1件として集計される）
  useEffect(() => {
    if (phase !== "result" || !result) return;
    const sig = answers.join(",");
    let cancelled = false;
    (async () => {
      try {
        const cid = getClientId();
        const marker = window.localStorage.getItem(SUBMITTED_KEY);
        if (marker !== sig) {
          const res = await fetch("/api/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: cid, a: answers.map((v) => v ?? 0) }),
          });
          if (!res.ok) return;
          window.localStorage.setItem(SUBMITTED_KEY, sig);
        }
        if (!cancelled) setMyId(cid);
      } catch {
        /* オフライン等は無視（診断自体は成立する） */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [phase, result, answers]);

  function answer(value: number) {
    const next = answers.slice();
    next[idx] = value;
    setAnswers(next);
    window.scrollTo({ top: 0 });
    if (idx + 1 >= total) {
      setPhase("result");
    } else {
      setIdx(idx + 1);
    }
  }

  function retry() {
    setAnswers(Array(total).fill(null));
    setIdx(0);
    setPhase("quiz");
    window.scrollTo({ top: 0 });
  }

  /** 途中再開した時などに、最初からやり直す（確認付き） */
  function restart() {
    if (!window.confirm("最初からやり直しますか？（ここまでの回答は消えます）")) return;
    retry();
  }

  if (!hydrated) {
    return (
      <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8">
        <p className="mt-24 text-center text-sm text-mut">読み込み中…</p>
      </main>
    );
  }

  if (phase === "result" && result) {
    return <ResultView scores={result.scores} ranked={result.ranked} onRetry={retry} myId={myId} />;
  }

  const q = QUESTIONS[idx];
  const progress = Math.round((idx / total) * 100);

  return (
    <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-8">
      <div className="mb-4 flex items-center justify-between text-sm text-mut">
        <Link href="/" className="transition hover:text-foreground">
          ← トップへ
        </Link>
        <span className="tabular-nums">
          {idx + 1} / {total}
        </span>
      </div>

      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-panel2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>

      <div className="rounded-2xl border border-line bg-panel p-6 md:p-10">
        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-accent">Q{idx + 1}</p>
        <h2 className="mb-8 text-lg font-bold leading-relaxed md:text-2xl">{q.text}</h2>

        <div className="flex flex-col gap-3">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => answer(o.value)}
              className={`w-full rounded-xl border px-5 py-3.5 text-left text-base font-medium transition ${
                answers[idx] === o.value
                  ? "border-accent bg-accent/15 text-foreground"
                  : "border-line bg-panel2 text-foreground hover:border-accent/60 hover:bg-accent/10"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              if (idx > 0) {
                setIdx(idx - 1);
                window.scrollTo({ top: 0 });
              }
            }}
            disabled={idx === 0}
            className="rounded-lg border border-line px-4 py-2 text-sm text-mut transition enabled:hover:border-accent enabled:hover:text-foreground disabled:opacity-30"
          >
            ← 前の質問
          </button>
          <div className="flex items-center gap-3">
            {answers[idx] !== null && (
              <span className="text-xs text-mut">回答済み（タップで変更できます）</span>
            )}
            {(idx > 0 || answers.some((a) => a !== null)) && (
              <button
                onClick={restart}
                className="text-xs text-mut underline underline-offset-2 transition hover:text-foreground"
              >
                最初からやり直す
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-mut">
        直感で答えるのがおすすめです。考えすぎるとヒカマーに怒られます。
      </p>
    </main>
  );
}

function ResultView({
  scores,
  ranked,
  onRetry,
  myId,
}: {
  scores: Scores;
  ranked: MatchResult[];
  onRetry: () => void;
  myId: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const main = ranked[0];
  const sub = daiHikamerSubtype(main.ideology, scores);
  const share = shareText(scores, main);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const myUrl = myId ? `${origin}/r/${myId}` : origin;
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(share)}&url=${encodeURIComponent(myUrl)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${share}\n${myUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl grow px-4 pb-24 pt-10">
      <p className="mb-2 text-center text-xs font-bold tracking-[0.3em] text-accent">
        DIAGNOSIS RESULT
      </p>
      <h1 className="mb-8 text-center text-2xl font-black md:text-3xl">
        あなたのヒカマニ思想
      </h1>

      {/* メイン結果カード */}
      <div className="mb-6 rounded-2xl border border-accent/40 bg-panel p-6 text-center md:p-10">
        {main.ideology.tags && (
          <div className="mb-2 text-lg tracking-widest">{main.ideology.tags}</div>
        )}
        <h2 className="mb-3 text-3xl font-black text-accent md:text-4xl">
          {main.ideology.name}
        </h2>
        {sub && (
          <p className="mb-3 text-sm font-bold text-amber">
            分類: {sub.name} — {sub.desc}
          </p>
        )}
        <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-foreground/90">
          {main.ideology.desc}
        </p>
        {main.ideology.flavor && (
          <p className="mb-4 text-xs text-mut">{main.ideology.flavor}</p>
        )}
        <p className="text-xs text-mut">一致度 {main.match}%</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-mut">強い傾向:</span>
          {topAxes(scores, 3).map((t) => (
            <span
              key={t.label}
              className="rounded-full border border-line bg-panel2 px-3 py-1 text-xs"
            >
              {t.label}{" "}
              <span className="font-bold tabular-nums text-accent">{t.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 9つの軸（18の価値） */}
      <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
        <h3 className="mb-5 text-sm font-bold tracking-widest text-mut">9つの軸（18の価値）</h3>
        <div className="flex flex-col gap-4">
          {AXES.map((axis) => (
            <GaugeRow key={axis} axis={axis} value={scores[axis]} />
          ))}
        </div>
      </section>

      {/* 思想マップ */}
      <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
        <h3 className="mb-1 text-sm font-bold tracking-widest text-mut">思想マップ</h3>
        <p className="mb-4 text-xs text-mut">
          ヒカマーズ思想コンパス（@Hiwai_7）と同じ軸に、あなたの座標をプロットしました。
        </p>
        <div className="flex justify-center">
          <Compass scores={scores} ranked={ranked} />
        </div>
      </section>

      {/* 近い思想トップ3 */}
      <section className="mb-8 rounded-2xl border border-line bg-panel p-6 md:p-8">
        <h3 className="mb-4 text-sm font-bold tracking-widest text-mut">
          あなたに近い思想
        </h3>
        <ul className="flex flex-col gap-3">
          {ranked.slice(0, 3).map((r, i) => (
            <li
              key={r.ideology.id}
              className="flex items-start gap-3 rounded-xl border border-line bg-panel2 p-4"
            >
              <span className="mt-0.5 text-lg font-black text-accent">{i + 1}</span>
              <div className="grow">
                <p className="font-bold">
                  {r.ideology.name}
                  <span className="ml-2 text-xs font-normal text-mut">
                    一致度 {r.match}%
                  </span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-mut">{r.ideology.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* シェア */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={intent}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background transition hover:opacity-85"
          >
            Xでシェア
          </a>
          <button
            onClick={copy}
            className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
          >
            {copied ? "コピーしました" : "結果をコピー"}
          </button>
          <button
            onClick={onRetry}
            className="rounded-xl border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:border-accent"
          >
            もう一度診断する
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
          {myId && (
            <Link
              href={`/r/${myId}`}
              className="text-accent underline underline-offset-2 transition hover:opacity-80"
            >
              あなたの結果ページを見る（共有用）
            </Link>
          )}
          <Link
            href="/stats"
            className="text-mut underline underline-offset-2 transition hover:text-foreground"
          >
            みんなの結果（統計）
          </Link>
        </div>
        <Link href="/" className="text-xs text-mut underline-offset-4 hover:underline">
          トップに戻る
        </Link>
      </div>

      <p className="mb-2 text-center text-xs leading-relaxed text-mut">
        ※回答と結果は匿名（ランダムIDのみ）で記録され、みんなの結果として自動集計されます。
      </p>
      <p className="text-center text-xs leading-relaxed text-mut">
        ※この診断は 8values のオマージュです。思想名・分類は界隈の呼称をネタとして扱ったもので、
        特定の立場の推奨ではありません。元ネタ: ヒカマーズグラフ・ヒカマーズ思想（@Hiwai_7）、
        ヒカマーwiki「ヒカマー界隈のイデオロギー一覧」・「勢力」カテゴリ・呼称一覧。
      </p>
    </main>
  );
}

function GaugeRow({ axis, value }: { axis: Axis; value: number }) {
  const meta = AXIS_META[axis];
  const order = GAUGE_ORDER[axis];
  const leftPct = order.leftIsPlus ? value : 100 - value;
  const rightLabel = order.right;

  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-2 text-sm">
        <span className="whitespace-nowrap font-bold">
          {order.left} <span className="tabular-nums">{leftPct}</span>
        </span>
        <span className="hidden text-xs text-mut md:inline">{meta.desc}</span>
        <span className="whitespace-nowrap font-bold text-mut">
          {rightLabel} <span className="tabular-nums">{100 - leftPct}</span>
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-panel2">
        <div
          className="transition-all duration-700"
          style={{ width: `${Math.max(leftPct, 1.5)}%`, background: order.color }}
        />
        <div style={{ width: `${100 - Math.max(leftPct, 1.5)}%`, background: "#1a2333" }} />
      </div>
    </div>
  );
}

function Compass({ scores, ranked }: { scores: Scores; ranked: MatchResult[] }) {
  const S = 460;
  const PAD = 56;
  const inner = S - PAD * 2;
  const xOf = (v: number) => PAD + ((100 - v) / 200) * inner; // v:-100(伝統)〜100(進歩)
  const yOf = (v: number) => PAD + ((100 - v) / 200) * inner; // v:-100(穏健)〜100(過激)

  const top3 = ranked.slice(0, 3).map((r) => r.ideology);
  const ux = xOf((scores.trad - 50) * 2);
  const uy = yOf((scores.rad - 50) * 2);

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-[440px]" role="img" aria-label="思想マップ">
      {/* 背景 */}
      <rect x="0" y="0" width={S} height={S} rx="16" fill="#0d131c" />
      <rect
        x={PAD}
        y={PAD}
        width={inner}
        height={inner}
        rx="8"
        fill="#10161f"
        stroke="#1f2a3a"
      />
      {/* 十字線 */}
      <line x1={S / 2} y1={PAD} x2={S / 2} y2={S - PAD} stroke="#1f2a3a" strokeDasharray="4 6" />
      <line x1={PAD} y1={S / 2} x2={S - PAD} y2={S / 2} stroke="#1f2a3a" strokeDasharray="4 6" />

      {/* 全ての思想（薄い点） */}
      {IDEOLOGIES.filter((it) => !top3.includes(it)).map((it) => (
        <circle key={it.id} cx={xOf(it.ideal.trad)} cy={yOf(it.ideal.rad)} r="3" fill="#33415c" />
      ))}
      {/* 近い3件 */}
      {top3.map((it, i) => (
        <g key={it.id}>
          <circle cx={xOf(it.ideal.trad)} cy={yOf(it.ideal.rad)} r="5.5" fill="#8b98a9" />
          <text
            x={xOf(it.ideal.trad)}
            y={yOf(it.ideal.rad) - 10}
            textAnchor="middle"
            fontSize="11"
            fontWeight={i === 0 ? 700 : 500}
            fill={i === 0 ? "#e6edf3" : "#8b98a9"}
          >
            {it.name}
          </text>
        </g>
      ))}
      {/* あなた */}
      <circle cx={ux} cy={uy} r="11" fill="#f783ac" opacity="0.25" />
      <circle cx={ux} cy={uy} r="6.5" fill="#f783ac" stroke="#e6edf3" strokeWidth="1.5" />
      <text x={ux} y={uy - 14} textAnchor="middle" fontSize="12" fontWeight={800} fill="#f783ac">
        あなた
      </text>

      {/* 軸ラベル */}
      <text x={PAD} y={S - PAD + 30} fontSize="13" fontWeight={700} fill="#f4a261">
        伝統
      </text>
      <text x={S - PAD} y={S - PAD + 30} fontSize="13" fontWeight={700} fill="#1d9bf0" textAnchor="end">
        進歩
      </text>
      <text x={S / 2} y={26} fontSize="13" fontWeight={700} fill="#ff6b6b" textAnchor="middle">
        過激
      </text>
      <text x={S / 2} y={S - 14} fontSize="13" fontWeight={700} fill="#57d9a3" textAnchor="middle">
        穏健
      </text>
    </svg>
  );
}
