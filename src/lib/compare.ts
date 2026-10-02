import type { Axis } from "@/data/questions";
import { AXES } from "@/lib/scoring";
import type { Submission } from "@/lib/store";

export interface AxisDiff {
  axis: Axis;
  va: number;
  vb: number;
  diff: number;
}

export interface CompareResult {
  sim: number; // 0-100（9軸の平均的な近さ = 100 - 平均差）
  rows: AxisDiff[];
  agreeTop: AxisDiff[]; // 差が小さい軸トップ3
  diffTop: AxisDiff[]; // 差が大きい軸トップ3
}

export function computeCompare(a: Submission, b: Submission): CompareResult {
  const rows = AXES.map((axis, i) => {
    const va = a.s[i];
    const vb = b.s[i];
    return { axis, va, vb, diff: Math.abs(va - vb) };
  });
  const sim = Math.round(rows.reduce((s, r) => s + (100 - r.diff), 0) / rows.length);
  const agreeTop = [...rows].sort((x, y) => x.diff - y.diff).slice(0, 3);
  const diffTop = [...rows].sort((x, y) => y.diff - x.diff).slice(0, 3);
  return { sim, rows, agreeTop, diffTop };
}

/** 相性スコアのラベル（界隈ノリ） */
export function simTier(sim: number): { label: string } {
  if (sim >= 90) return { label: "ほぼ同一人物" };
  if (sim >= 75) return { label: "同じ穴のムジナ" };
  if (sim >= 60) return { label: "気が合う仲間" };
  if (sim >= 45) return { label: "ふつう" };
  if (sim >= 30) return { label: "ノリが違うかも" };
  return { label: "真逆（むしろ好敵手）" };
}
