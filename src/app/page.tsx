import Image from "next/image";
import Link from "next/link";

const AXIS_CARDS = [
  {
    t: "伝統 ↔ 進歩",
    d: "ヒカマニ外伝・音MADの古典文化を重んじるか、ヒカマー界隈の新しい流れを推すか。",
  },
  {
    t: "穏健 ↔ 過激",
    d: "大衆的でマイルドか、アルカイダ・制裁に代表される排他的・先鋭的なノリか。",
  },
  {
    t: "閉鎖 ↔ 拡大",
    d: "小ヒカマー主義的に身内の純度を守るか、大ヒカマー主義的に界隈を広げていくか。",
  },
  {
    t: "秩序 ↔ 自由",
    d: "規範やクレジットを重んじるか、著作権も開示請求も否定するリバタリアンか。",
  },
];

export default function Home() {
  return (
    <main className="grow">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-6">
        <span className="text-sm font-black tracking-wider">ヒカマーズ8values</span>
        <Link
          href="/quiz"
          className="rounded-lg border border-line px-4 py-2 text-xs font-bold transition hover:border-accent"
        >
          診断する
        </Link>
      </header>

      {/* ヒーロー */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-14 text-center md:pt-24">
        <p className="mb-4 text-xs font-bold tracking-[0.4em] text-accent">
          HIKAMER 8VALUES
        </p>
        <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
          あなたのヒカマニ思想を、
          <br />
          8つの価値観で診断。
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-mut md:text-base">
          全54問・4つの軸で、あなたのヒカマー界隈での立ち位置を言語化します。元ネタは、いま界隈で話題の
          「ヒカマーズグラフ」「ヒカマーズ思想」（@Hiwai_7）と、ヒカマーwikiの
          「ヒカマー界隈のイデオロギー一覧」。
        </p>
        <Link
          href="/quiz"
          className="inline-block rounded-2xl bg-accent px-10 py-4 text-lg font-black text-white transition hover:opacity-90"
        >
          診断をはじめる
        </Link>
        <p className="mt-4 text-xs text-mut">所要時間: 約3分／登録不要／全27タイプ</p>
      </section>

      {/* 4つの軸 */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <h2 className="mb-6 text-center text-xl font-black">診断の4軸</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {AXIS_CARDS.map((a) => (
            <div key={a.t} className="rounded-2xl border border-line bg-panel p-6">
              <h3 className="mb-2 font-black">{a.t}</h3>
              <p className="text-sm leading-relaxed text-mut">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 元ネタ */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <h2 className="mb-2 text-center text-xl font-black">元ネタとなった2つの図</h2>
        <p className="mb-8 text-center text-sm text-mut">
          どちらも @Hiwai_7 が作図・提唱したもの。
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <figure>
            <Image
              src="/graph-thoughts.jpg"
              alt="ヒカマニ思想マップ（試作）"
              width={1600}
              height={1600}
              className="rounded-2xl border border-line"
            />
            <figcaption className="mt-3 text-xs leading-relaxed text-mut">
              ヒカマニ思想マップ（試作・2026-09-26）— 伝統/進歩 ×
              過激/穏健の4象限に各思想を配置したもの。
              <a
                href="https://x.com/Hiwai_7/status/2103863003846430901"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-accent underline-offset-2 hover:underline"
              >
                元ポスト
              </a>
            </figcaption>
          </figure>
          <figure>
            <Image
              src="/graph-members.jpg"
              alt="ヒカマーズグラフ 1訂版"
              width={1600}
              height={1600}
              className="rounded-2xl border border-line"
            />
            <figcaption className="mt-3 text-xs leading-relaxed text-mut">
              ヒカマーズグラフ（1訂版・2026-09-30）— 古参/新参 ×
              過激・ニッチ/穏健に界隈の面々をプロットしたもの。
              <a
                href="https://x.com/Hiwai_7/status/2105280253530911112"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-accent underline-offset-2 hover:underline"
              >
                元ポスト
              </a>
            </figcaption>
          </figure>
        </div>
        <p className="mt-6 text-center text-xs leading-relaxed text-mut">
          思想の分類は
          <a
            href="https://hikamers.net/wiki/%E3%82%A4%E3%83%87%E3%82%AA%E3%83%AD%E3%82%AE%E3%83%BC"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-1 text-accent underline-offset-2 hover:underline"
          >
            ヒカマーwiki「ヒカマー界隈のイデオロギー一覧」
          </a>
          と「ヒカマニ思想一覧」を参照しています。
        </p>
      </section>

      {/* この診断について */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-24">
        <h2 className="mb-4 text-center text-xl font-black">この診断について</h2>
        <div className="rounded-2xl border border-line bg-panel p-6 text-sm leading-relaxed text-mut md:p-8">
          <p className="mb-3">
            「ヒカマーズ8values」は、政治思想診断「8values」のオマージュとして、
            ヒカマー界隈の思想・派閥・ノリを8つの価値に落とし込んだファン診断です。
            質問に直感で答えると、伝統〜進歩、穏健〜過激、閉鎖〜拡大、秩序〜自由の4軸であなたの座標が決まり、
            最も近い思想（全27タイプ）が表示されます。
          </p>
          <p>
            結果はネタです。誰かを攻撃するためのものではありません。気に入ったらXでシェアして、
            友達の思想も診断してあげてください。
          </p>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs leading-relaxed text-mut">
          <p className="font-bold text-foreground">ヒカマーズ8values</p>
          <p className="mt-1">
            元ネタ: ヒカマーズグラフ・ヒカマーズ思想（
            <a
              href="https://x.com/Hiwai_7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              @Hiwai_7
            </a>
            ）／ヒカマーwiki「ヒカマー界隈のイデオロギー一覧」／8values.github.io のオマージュ
          </p>
        </div>
      </footer>
    </main>
  );
}
