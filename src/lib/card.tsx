import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { AXES, topAxes, type Scores } from "@/lib/scoring";
import { IDEOLOGIES } from "@/data/results";
import { GAUGE_ORDER } from "@/lib/axis-ui";
import type { Stats, Submission } from "@/lib/store";
import { simTier, type CompareResult } from "@/lib/compare";

/** OG画像（Xカード用 1200x630）と投稿画像（4:5 1080x1350）のサイズ */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const POST_SIZE = { width: 1080, height: 1350 } as const;

type CardFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

let fontsPromise: Promise<CardFont[]> | null = null;

export function loadCardFonts(): Promise<CardFont[]> {
  fontsPromise ??= (async () => {
    const dir = path.join(process.cwd(), "public", "fonts");
    const read = async (file: string): Promise<ArrayBuffer> => {
      const buf = await readFile(path.join(dir, file));
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    };
    const [regular, bold] = await Promise.all([
      read("NotoSansJP-Regular.ttf"),
      read("NotoSansJP-Bold.ttf"),
    ]);
    return [
      { name: "Noto Sans JP", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Noto Sans JP", data: bold, weight: 700 as const, style: "normal" as const },
    ];
  })();
  return fontsPromise;
}

const C = {
  fg: "#f4f4f8",
  mut: "#8b98a9",
  line: "#1f2a3a",
  panel2: "#151d29",
  accent: "#1d9bf0",
  amber: "#f4a261",
};

/** 表示名の正規化（空白圧縮） */
function dispName(n?: string): string {
  return (n ?? "").replace(/\s+/g, " ").trim();
}

/** 長すぎる文字列を省略記号付きで切る */
function trunc(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

function Frame({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #06060b 0%, #0a0f1d 60%, #101a2e 100%)",
        color: C.fg,
        fontFamily: "'Noto Sans JP'",
        padding: wide ? 70 : 54,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", fontSize: wide ? 30 : 26, fontWeight: 700 }}>ヒカマーズ8values</div>
        <div style={{ display: "flex", fontSize: wide ? 18 : 16, color: C.mut }}>
          hikamer8values.hikamers.app
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function AxesGrid({ scores }: { scores: number[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: 30 }}>
      {[0, 1, 2].map((ci) => (
        <div
          key={ci}
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            flexBasis: 0,
            marginRight: ci < 2 ? 34 : 0,
          }}
        >
          {AXES.slice(ci * 3, ci * 3 + 3).map((axis, k) => {
            const i = ci * 3 + k;
            const o = GAUGE_ORDER[axis];
            const leftPct = Math.round(o.leftIsPlus ? scores[i] : 100 - scores[i]);
            return (
              <div
                key={axis}
                style={{ display: "flex", flexDirection: "column", marginTop: k > 0 ? 16 : 0 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 15,
                    color: C.mut,
                    marginBottom: 5,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {o.left} {leftPct}
                  </div>
                  <div style={{ display: "flex" }}>
                    {100 - leftPct} {o.right}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    height: 10,
                    width: "100%",
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "#1a2333",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexGrow: Math.max(leftPct, 0.5),
                      background: o.color,
                    }}
                  />
                  <div style={{ display: "flex", flexGrow: Math.max(100 - leftPct, 0.5) }} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Chips({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: 24 }}>
      {items.map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            border: `2px solid ${C.line}`,
            background: C.panel2,
            borderRadius: 999,
            padding: "9px 24px",
            fontSize: 20,
            marginRight: 14,
          }}
        >
          <div style={{ display: "flex", color: C.mut, marginRight: 10 }}>{c.label}</div>
          <div style={{ display: "flex", fontWeight: 700, color: C.accent }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}

/** 診断結果カード */
export function ResultCard({ sub, wide }: { sub: Submission; wide?: boolean }) {
  const ideo = IDEOLOGIES.find((i) => i.id === sub.t);
  const scores = {} as Scores;
  AXES.forEach((ax, i) => {
    scores[ax] = sub.s[i];
  });
  const top = topAxes(scores, 3);
  const name = ideo?.name ?? sub.t;
  const base = name.length <= 8 ? 68 : name.length <= 12 ? 56 : 46;
  return (
    <Frame wide={wide}>
      <div style={{ display: "flex", fontSize: 26, color: C.mut, marginBottom: 6 }}>
        {sub.n ? `${trunc(dispName(sub.n), 20)} のヒカマニ思想` : "とあるヒカマーのヒカマニ思想"}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: wide ? base + 8 : base,
          fontWeight: 700,
          color: C.accent,
        }}
      >
        {name}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
        <div style={{ display: "flex", fontSize: 26, color: C.mut, marginRight: 14 }}>一致度</div>
        <div style={{ display: "flex", fontSize: 46, fontWeight: 700, color: C.amber }}>
          {sub.m}%
        </div>
      </div>
      <Chips items={top.map((t) => ({ label: t.label, value: String(t.value) }))} />
      <AxesGrid scores={sub.s} />
    </Frame>
  );
}

/** みんなの結果カード */
export function StatsCard({ stats }: { stats: Stats }) {
  const chips = stats.typeCounts
    .slice(0, 3)
    .map((c) => ({ label: trunc(c.name, 10), value: `${c.count}人` }));
  return (
    <Frame>
      <div style={{ display: "flex", fontSize: 26, color: C.mut, marginBottom: 6 }}>
        みんなの結果（回答 {stats.total} 件）
      </div>
      <div style={{ display: "flex", fontSize: 62, fontWeight: 700, color: C.accent }}>
        {stats.avgNearest?.name ?? "まだ集計中"}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: C.mut, marginTop: 8 }}>
        平均プロファイルに最も近い思想（一致度 {stats.avgNearest?.match ?? 0}%）
      </div>
      {chips.length > 0 && <Chips items={chips} />}
      <AxesGrid scores={stats.axisAvg} />
    </Frame>
  );
}

/** 相性診断カード */
export function CompareCard({ a, b, cmp }: { a: Submission; b: Submission; cmp: CompareResult }) {
  const rawA = dispName(a.n) || "匿名";
  const rawB = dispName(b.n) || "匿名";
  const nameA = rawA.length <= 8 ? rawA : trunc(rawA, 9);
  const nameB = rawB.length <= 8 ? rawB : trunc(rawB, 9);
  const nameFs = rawA.length <= 8 && rawB.length <= 8 ? 52 : 44;
  const iA = IDEOLOGIES.find((i) => i.id === a.t)?.name ?? a.t;
  const iB = IDEOLOGIES.find((i) => i.id === b.t)?.name ?? b.t;
  const tier = simTier(cmp.sim);
  const chips = cmp.diffTop.map((d) => {
    const o = GAUGE_ORDER[d.axis];
    return { label: `${o.left}↔${o.right}`, value: `差${d.diff}` };
  });
  return (
    <Frame>
      <div style={{ display: "flex", fontSize: 26, color: C.mut, marginBottom: 6 }}>
        思想相性診断
      </div>
      <div style={{ display: "flex", fontSize: nameFs, fontWeight: 700, alignItems: "center" }}>
        <div style={{ display: "flex" }}>{nameA}</div>
        <div style={{ display: "flex", color: C.mut, margin: "0 20px" }}>×</div>
        <div style={{ display: "flex" }}>{nameB}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 14 }}>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: C.accent }}>
          {cmp.sim}%
        </div>
        <div
          style={{ display: "flex", marginLeft: 26, fontSize: 32, fontWeight: 700, color: C.amber }}
        >
          {tier.label}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
        <div style={{ display: "flex", fontSize: 23, color: C.mut }}>
          {nameA}：{trunc(iA, 14)}
        </div>
        <div style={{ display: "flex", fontSize: 23, color: C.mut, marginTop: 4 }}>
          {nameB}：{trunc(iB, 14)}
        </div>
      </div>
      <Chips items={chips} />
    </Frame>
  );
}

/** 汎用カード（トップ/未登録結果用） */
export function GenericCard() {
  return (
    <Frame>
      <div style={{ display: "flex", fontSize: 26, color: C.mut, marginBottom: 8 }}>
        ヒカマー界隈の思想診断
      </div>
      <div style={{ display: "flex", fontSize: 92, fontWeight: 700, color: C.accent }}>
        ヒカマーズ8values
      </div>
      <div style={{ display: "flex", fontSize: 30, marginTop: 16 }}>
        全70問・9つの軸で、あなたのヒカマニ思想を診断。
      </div>
      <Chips
        items={[
          { label: "質問", value: "全70問" },
          { label: "診断軸", value: "9軸・18の価値" },
          { label: "タイプ", value: "全52種" },
        ]}
      />
    </Frame>
  );
}
