import { promises as fs } from "node:fs";
import path from "node:path";
import { AXES, computeScores, rankIdeologies, type Scores } from "@/lib/scoring";
import { IDEOLOGIES } from "@/data/results";

/**
 * 回答の匿名収集ストア（JSONL 追記式）。
 * - 保存先: `${DATA_DIR ?? cwd/data}/results.jsonl`（コンテナでは /app/data をボリュームマウント）
 * - 1端末(=ランダムID)につき最新の1件だけを集計に使う
 */

export interface Submission {
  id: string; // 匿名端末ID（[a-z0-9]{6,32}）
  ts: number; // サーバ受信時刻(ms)
  t: string; // タイプID（サーバ側で再計算）
  m: number; // 一致度（サーバ側で再計算）
  s: number[]; // 9軸スコア 0-100（AXES順）
  a: number[]; // 70問の回答 -2..2
  n?: string; // 公開名（任意・入力時のみ） 
  qv?: number; // 質問バージョン（v3以降付与。未設定=旧版）
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "results.jsonl");
const ID_RE = /^[a-z0-9]{6,32}$/;

/** 質問文の改訂バージョン（v3=2026-10「賛否が割れる」改訂） */
export const QUESTIONS_VERSION = 3;
/** v3で文面を改訂した設問ID（この設問の分布は qv>=3 の回答のみ対象） */
export const CHANGED_QUESTIONS_V3: number[] = [
  1, 3, 4, 11, 14, 16, 17, 22, 24, 27, 35, 36, 41, 42, 44, 45, 46, 47, 49, 50, 54, 56, 57, 60,
  62, 64, 67,
];

/** クライアントから届いた {id, a} を検証して保存用レコードに変換（スコアはサーバ側で再計算） */
export function validateAndBuild(v: unknown): Submission | null {
  if (typeof v !== "object" || v === null) return null;
  const o = v as Record<string, unknown>;
  const { id, a } = o;
  if (typeof id !== "string" || !ID_RE.test(id)) return null;
  if (
    !Array.isArray(a) ||
    a.length !== 70 ||
    !a.every((x) => typeof x === "number" && Number.isInteger(x) && x >= -2 && x <= 2)
  ) {
    return null;
  }
  const answers = a as number[];
  const scores = computeScores(answers);
  const ranked = rankIdeologies(scores);
  const main = ranked[0];
  return {
    id,
    ts: Date.now(),
    t: main.ideology.id,
    m: main.match,
    s: AXES.map((ax) => scores[ax]),
    a: answers,
    n: cleanName(o.n),
    qv: QUESTIONS_VERSION,
  };
}

/** 公開名のサニタイズ（制御文字除去・24文字まで・空なら undefined=匿名） */
export function cleanName(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.replace(/[\u0000-\u001f\u007f\u2028\u2029]/g, "").trim();
  if (!s) return undefined;
  return s.slice(0, 24);
}

export async function appendSubmission(sub: Submission): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(FILE, JSON.stringify(sub) + "\n", "utf8");
}

let cache: { key: string; data: Submission[] } = { key: "", data: [] };

export async function loadSubmissions(): Promise<Submission[]> {
  let key: string;
  try {
    const st = await fs.stat(FILE);
    key = `${st.mtimeMs}:${st.size}`;
    if (cache.key === key) return cache.data;
  } catch {
    return []; // まだファイルが無い = 回答ゼロ
  }
  const raw = await fs.readFile(FILE, "utf8");
  const out: Submission[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const j = JSON.parse(line) as Submission;
      if (
        j &&
        typeof j.id === "string" &&
        typeof j.ts === "number" &&
        Array.isArray(j.s) &&
        j.s.length === 9 &&
        Array.isArray(j.a) &&
        j.a.length === 70
      ) {
        out.push(j);
      }
    } catch {
      /* 壊れた行は無視 */
    }
  }
  cache = { key, data: out };
  return out;
}

/** 端末IDごとに最新の1件へ（1端末=1票） */
export function latestPerClient(subs: Submission[]): Submission[] {
  const map = new Map<string, Submission>();
  for (const s of subs) map.set(s.id, s);
  return [...map.values()];
}

export function findSubmission(subs: Submission[], id: string): Submission | null {
  let found: Submission | null = null;
  for (const s of subs) if (s.id === id) found = s;
  return found;
}

export function fmtTs(ts: number): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export interface Stats {
  total: number;
  axisAvg: number[]; // 9軸平均 0-100
  avgNearest: { name: string; match: number } | null; // 平均に最も近いタイプ
  typeCounts: { id: string; name: string; count: number }[];
  qDist: { p: number; z: number; n: number }[]; // 設問ごとの 賛成/中立/反対 人数
  recent: { id: string; t: string; m: number; ts: number; n?: string }[];
}

export function computeStats(subs: Submission[], recentLimit = 60): Stats {
  const latest = latestPerClient(subs);
  const total = latest.length;

  const axisAvg = AXES.map((_, i) =>
    total > 0 ? Math.round(latest.reduce((s, x) => s + x.s[i], 0) / total) : 50,
  );

  let avgNearest: Stats["avgNearest"] = null;
  if (total > 0) {
    const scores = {} as Scores;
    AXES.forEach((ax, i) => {
      scores[ax] = axisAvg[i];
    });
    const r = rankIdeologies(scores)[0];
    avgNearest = { name: r.ideology.name, match: r.match };
  }

  const counts = new Map<string, number>();
  for (const x of latest) counts.set(x.t, (counts.get(x.t) ?? 0) + 1);
  const nameOf = new Map(IDEOLOGIES.map((i) => [i.id, i.name]));
  const typeCounts = [...counts.entries()]
    .map(([id, count]) => ({ id, name: nameOf.get(id) ?? id, count }))
    .sort((a, b) => b.count - a.count);

  const qDist = Array.from({ length: 70 }, (_, i) => {
    const changed = CHANGED_QUESTIONS_V3.includes(i + 1);
    let p = 0;
    let z = 0;
    let n = 0;
    for (const x of latest) {
      if (changed && (x.qv ?? 2) < QUESTIONS_VERSION) continue; // 改訂前の回答は除外
      const v = x.a[i];
      if (v >= 1) p++;
      else if (v <= -1) n++;
      else z++;
    }
    return { p, z, n };
  });

  const recent = [...latest]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, recentLimit)
    .map((x) => ({ id: x.id, t: x.t, m: x.m, ts: x.ts, n: x.n }));

  return { total, axisAvg, avgNearest, typeCounts, qDist, recent };
}
