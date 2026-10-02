import type { Axis } from "@/data/questions";

/** 9軸ゲージの左右ラベル・色（結果画面/統計ページ/個人ページで共用） */
export const GAUGE_ORDER: Record<Axis, { left: string; right: string; leftIsPlus: boolean; color: string }> = {
  trad: { left: "伝統", right: "進歩", leftIsPlus: true, color: "#f4a261" },
  rad: { left: "穏健", right: "過激", leftIsPlus: false, color: "#57d9a3" },
  exp: { left: "閉鎖", right: "拡大", leftIsPlus: false, color: "#b197fc" },
  lib: { left: "秩序", right: "自由", leftIsPlus: false, color: "#74c0fc" },
  dev: { left: "反開發", right: "親開發", leftIsPlus: false, color: "#ff8787" },
  gen: { left: "世代フラット", right: "古参崇敬", leftIsPlus: false, color: "#63e6be" },
  sanc: { left: "平和", right: "制裁", leftIsPlus: false, color: "#d0bfff" },
  pol: { left: "非政治", right: "政治親和", leftIsPlus: false, color: "#a9e34b" },
  nare: { left: "孤高", right: "馴れ合い", leftIsPlus: false, color: "#66d9e8" },
};
