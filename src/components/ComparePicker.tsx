"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface PickItem {
  id: string;
  label: string;
}

export default function ComparePicker({ items, presetA }: { items: PickItem[]; presetA?: string }) {
  const router = useRouter();
  const [a, setA] = useState(presetA && items.some((i) => i.id === presetA) ? presetA : "");
  const [b, setB] = useState("");

  const ready = a !== "" && b !== "" && a !== b;

  function go() {
    if (ready) router.push(`/compare/${a}/${b}`);
  }

  function swap() {
    setA(b);
    setB(a);
  }

  const selectCls =
    "w-full rounded-xl border border-line bg-panel2 px-4 py-3 text-sm outline-none transition focus:border-accent";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-accent">1人目（あの人）</span>
          <select value={a} onChange={(e) => setA(e.target.value)} className={selectCls}>
            <option value="">— 選んでください —</option>
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold" style={{ color: "#ff2e88" }}>
            2人目（もう1人）
          </span>
          <select value={b} onChange={(e) => setB(e.target.value)} className={selectCls}>
            <option value="">— 選んでください —</option>
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={go}
          disabled={!ready}
          className="rounded-xl bg-accent px-8 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-30"
        >
          相性を見る
        </button>
        <button
          onClick={swap}
          disabled={a === "" && b === ""}
          className="rounded-xl border border-line bg-panel px-5 py-3 text-sm font-bold transition hover:border-accent disabled:opacity-30"
        >
          ⇄ 入れ替え
        </button>
      </div>
      {a !== "" && a === b && (
        <p className="text-center text-xs text-danger">同じ人同士は選べません。</p>
      )}
    </div>
  );
}
