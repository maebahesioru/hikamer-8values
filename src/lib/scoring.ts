import { QUESTIONS, type Axis } from "@/data/questions";
import { IDEOLOGIES, DAI_HIKAMER_SUBTYPES, type Ideology } from "@/data/results";

export const AXES: Axis[] = ["trad", "rad", "exp", "lib"];

export interface AxisMeta {
  key: Axis;
  /** スコア100側の価値名 */
  plus: string;
  /** スコア0側の価値名 */
  minus: string;
  /** 左(伝統/穏健/閉鎖/秩序)側ラベル */
  low: string;
  /** 右(進歩/過激/拡大/自由)側ラベル */
  high: string;
  desc: string;
}

export const AXIS_META: Record<Axis, AxisMeta> = {
  trad: {
    key: "trad",
    plus: "伝統",
    minus: "進歩",
    low: "伝統",
    high: "進歩",
    desc: "ヒカマニ的古典文化を重んじるか、ヒカマー的新文化を推すか。",
  },
  rad: {
    key: "rad",
    plus: "過激",
    minus: "穏健",
    low: "穏健",
    high: "過激",
    desc: "大衆的でマイルドか、排他的で先鋭的か。",
  },
  exp: {
    key: "exp",
    plus: "拡大",
    minus: "閉鎖",
    low: "閉鎖",
    high: "拡大",
    desc: "大ヒカマー主義的に広げるか、小ヒカマー主義的に閉じるか。",
  },
  lib: {
    key: "lib",
    plus: "自由",
    minus: "秩序",
    low: "秩序",
    high: "自由",
    desc: "規範・クレジットを重んじるか、反規制・リバタリアンか。",
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
  let wsum = 0;
  let wsq = 0;
  for (const axis of AXES) {
    // そのイデオロギーが「主張している軸」ほど重く見る（40 + |理想値|）
    const w = 40 + Math.abs(ideology.ideal[axis]);
    const diff = scores[axis] - ideology.ideal[axis];
    wsum += w;
    wsq += w * diff * diff;
  }
  const raw = Math.sqrt(wsq / wsum); // 0〜200
  return Math.max(1, Math.round(100 - raw / 2));
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
  let best: (typeof DAI_HIKAMER_SUBTYPES)[number] = DAI_HIKAMER_SUBTYPES[0];
  let bestDist = Infinity;
  for (const st of DAI_HIKAMER_SUBTYPES) {
    const d = Math.hypot(scores.rad - st.rad, scores.lib - st.lib);
    if (d < bestDist) {
      bestDist = d;
      best = st;
    }
  }
  return best;
}

/** シェア用テキスト */
export function shareText(scores: Scores, main: MatchResult): string {
  return [
    "【ヒカマーズ8values】",
    `私のヒカマニ思想は「${main.ideology.name}」(一致度${main.match}%)でした。`,
    `伝統${scores.trad}/進歩${100 - scores.trad}・穏健${100 - scores.rad}/過激${scores.rad}・閉鎖${100 - scores.exp}/拡大${scores.exp}・秩序${100 - scores.lib}/自由${scores.lib}`,
  ].join("\n");
}
