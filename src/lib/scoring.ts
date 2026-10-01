import { QUESTIONS, type Axis } from "@/data/questions";
import { IDEOLOGIES, DAI_HIKAMER_SUBTYPES, type Ideology } from "@/data/results";

export const AXES: Axis[] = ["trad", "rad", "exp", "lib", "dev", "gen", "sanc", "pol", "nare"];

export interface AxisMeta {
  key: Axis;
  /** スコア100側の価値名 */
  plus: string;
  /** スコア0側の価値名 */
  minus: string;
  desc: string;
}

export const AXIS_META: Record<Axis, AxisMeta> = {
  trad: {
    key: "trad",
    plus: "伝統",
    minus: "進歩",
    desc: "ヒカマニ的古典文化を重んじるか、ヒカマー的新文化を推すか。",
  },
  rad: {
    key: "rad",
    plus: "過激",
    minus: "穏健",
    desc: "大衆的でマイルドか、露悪・排他的で先鋭的か。",
  },
  exp: {
    key: "exp",
    plus: "拡大",
    minus: "閉鎖",
    desc: "大ヒカマー主義的に広げるか、小ヒカマー主義的に閉じるか。",
  },
  lib: {
    key: "lib",
    plus: "自由",
    minus: "秩序",
    desc: "規範・クレジットを重んじるか、反規制・リバタリアンか。",
  },
  dev: {
    key: "dev",
    plus: "親開發",
    minus: "反開發",
    desc: "開發家（ヒカキン一家）を応援するか、開發叩きに燃えるか。",
  },
  gen: {
    key: "gen",
    plus: "古参崇敬",
    minus: "世代フラット",
    desc: "古参・中参の格式を重んじるか、実力主義で世代フラットか。",
  },
  sanc: {
    key: "sanc",
    plus: "制裁",
    minus: "平和",
    desc: "制裁・情報開示で戦うか、ミュートと和解で流すか。",
  },
  pol: {
    key: "pol",
    plus: "政治親和",
    minus: "非政治",
    desc: "界隈に政治や思想論争を持ち込むか、ミームと政治を分けるか。",
  },
  nare: {
    key: "nare",
    plus: "馴れ合い",
    minus: "孤高",
    desc: "エンカ・交流で界隈を楽しむか、一匹狼・ROMで静かに見るか。",
  },
};

export type Scores = Record<Axis, number>;

/** answers[i] は -2〜+2（+2=賛成, 0=どちらでもない, -2=反対） */
export function computeScores(answers: number[]): Scores {
  const scores = {} as Scores;
  for (const axis of AXES) {
    let sum = 0;
    let max = 0;
    QUESTIONS.forEach((q, i) => {
      const w = q.w[axis] ?? 0;
      if (w === 0) return;
      const a = answers[i] ?? 0;
      sum += w * a;
      max += Math.abs(w) * 2;
    });
    scores[axis] = max === 0 ? 50 : Math.round(50 + (50 * sum) / max);
  }
  return scores;
}

export interface MatchResult {
  ideology: Ideology;
  match: number; // 0-100
}

function matchPercent(scores: Scores, ideology: Ideology): number {
  // 9軸対応の重み付き距離:
  // - ユーザーも思想も「主張が強い軸」ほど重く見る（中立軸はお互い軽い）
  // - 中立(50)は「軽い不一致」として扱い、極端な理想値でも過大に罰しない
  let wsum = 0;
  let wsq = 0;
  for (const axis of AXES) {
    const u = (scores[axis] - 50) / 50; // -1〜1
    const v = ideology.ideal[axis] / 100; // -1〜1
    const d = Math.abs(u - v) / 2; // 0〜1
    const w = (0.35 + 0.65 * Math.abs(u)) * (0.35 + 0.65 * Math.abs(v));
    wsum += w;
    wsq += w * d * d;
  }
  const raw = Math.sqrt(wsq / wsum); // 0〜1
  return Math.max(1, Math.round(100 - 130 * raw));
}

export function rankIdeologies(scores: Scores): MatchResult[] {
  // 全軸が中央付近（±8以内）のときだけ「非カマー」を候補に残す。
  // それ以外では中心点が引力井戸になって全部非カマーに寄るのを防ぐ。
  const centeredness = Math.max(...AXES.map((a) => Math.abs(scores[a] - 50)));
  const pool =
    centeredness <= 8 ? IDEOLOGIES : IDEOLOGIES.filter((i) => i.id !== "non-hikamer");
  return pool
    .map((ideology) => ({ ideology, match: matchPercent(scores, ideology) }))
    .sort((a, b) => b.match - a.match);
}

/** 大ヒカマー主義の場合、rad/lib から三次分類を選ぶ */
export function daiHikamerSubtype(ideology: Ideology, scores: Scores) {
  if (ideology.id !== "dai-hikamer") return null;
  const r = (scores.rad - 50) * 2; // -100〜100
  const l = (scores.lib - 50) * 2;
  let best: (typeof DAI_HIKAMER_SUBTYPES)[number] = DAI_HIKAMER_SUBTYPES[0];
  let bestDist = Infinity;
  for (const st of DAI_HIKAMER_SUBTYPES) {
    const d = Math.hypot(r - st.rad, l - st.lib);
    if (d < bestDist) {
      bestDist = d;
      best = st;
    }
  }
  return best;
}

/** スコアの偏りが大きい軸トップN（シェア用） */
export function topAxes(scores: Scores, n = 3): { label: string; value: number }[] {
  return AXES.map((axis) => {
    const v = scores[axis];
    const meta = AXIS_META[axis];
    const label = v >= 50 ? meta.plus : meta.minus;
    return { label, value: v >= 50 ? v : 100 - v, dev: Math.abs(v - 50) };
  })
    .sort((a, b) => b.dev - a.dev)
    .slice(0, n)
    .map(({ label, value }) => ({ label, value }));
}

/** シェア用テキスト */
export function shareText(scores: Scores, main: MatchResult): string {
  const top = topAxes(scores, 3)
    .map((t) => `${t.label}${t.value}`)
    .join("・");
  return [
    "【ヒカマーズ8values】",
    `私のヒカマニ思想は「${main.ideology.name}」(一致度${main.match}%)でした。`,
    `9つの軸: ${top} など`,
  ].join("\n");
}
