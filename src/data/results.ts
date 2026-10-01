/**
 * ヒカマーズ8values 診断結果（イデオロギー／勢力）データ・全52種
 * 出自: @Hiwai_7 の「ヒカマーズ思想」「ヒカマニ思想一覧」「ヒカマーズグラフ」、
 *       ヒカマーwiki（イデオロギー一覧・カテゴリ:勢力・呼称一覧ほか）、810ちゃんねる等
 * ideal: 各軸の理想値(-100〜100)。
 * +trad=伝統 / +rad=過激 / +exp=拡大 / +lib=自由 / +dev=親開發 / +gen=古参崇敬 / +sanc=制裁 / +pol=政治親和 / +nare=馴れ合い
 */

export interface Ideology {
  id: string;
  name: string;
  /** 思想一覧で使われているマーカー (🟦 ヒカマニ的 / 🟥 ヒカマー的 / 🟩 独自路線) */
  tags: string;
  desc: string;
  /** 提唱者・別名などの補足 */
  flavor?: string;
  ideal: {
    trad: number;
    rad: number;
    exp: number;
    lib: number;
    dev: number;
    gen: number;
    sanc: number;
    pol: number;
    nare: number;
  };
}

export const IDEOLOGIES: Ideology[] = [
  // ===== 古典・原理系 =====
  {
    id: "hikamani-fundamentalism",
    name: "ヒカマニ原理主義",
    tags: "🟦",
    desc: "ヒカマニを内輪の音MAD文化として保守し、淫夢や例のアレとの混交に否定的な立場。文脈の純度と界隈の境界を重んじる。",
    flavor: "別名: ヒカマニ保守主義・ヒカマニ民思想",
    ideal: { trad: 75, rad: 25, exp: -60, lib: -10, dev: 10, gen: 60, sanc: 20, pol: -20, nare: -20 },
  },
  {
    id: "hikamani-classicism",
    name: "ヒカマニ古典主義",
    tags: "🟦",
    desc: "往年の外伝・音MAD・名作ネタを「古典」として尊び、新作より再評価を進める立場。教養として後世に残したい。",
    ideal: { trad: 70, rad: -25, exp: -25, lib: -10, dev: 20, gen: 55, sanc: -10, pol: -20, nare: 0 },
  },
  {
    id: "primitive-hikamani",
    name: "原始ヒカマニ主義",
    tags: "🟩🟦",
    desc: "黎明期ヒカマニの空気と純度への回帰を求める原始回帰派。最初期の投稿・素材・ノリに理想を見る。超古参の鑑。",
    ideal: { trad: 90, rad: 30, exp: -65, lib: 10, dev: 15, gen: 80, sanc: 10, pol: -10, nare: -10 },
  },
  {
    id: "dai-hikamani",
    name: "大ヒカマニ主義",
    tags: "🟥🟦",
    desc: "ヒカマニを開かれた文化として、穏健に拡大していく立場。混交も拡張も前向きに捉える。",
    ideal: { trad: 20, rad: -30, exp: 80, lib: 10, dev: 60, gen: 20, sanc: -30, pol: -30, nare: 30 },
  },
  {
    id: "sho-hikamani",
    name: "小ヒカマニ主義",
    tags: "🟦",
    desc: "拡大に消極的で、身内のヒカマニ文化を静かに大切にする立場。外に開くより、内側の厚みを取る。",
    ideal: { trad: 50, rad: 20, exp: -80, lib: -15, dev: 25, gen: 40, sanc: 0, pol: -20, nare: -25 },
  },
  // ===== ヒカマー系 =====
  {
    id: "hikamer-ism",
    name: "ヒカマー主義",
    tags: "🟥",
    desc: "ヒカマニと例のアレ・淫夢の接続を肯定し、風刺的二次創作と界隈拡張を推す源流的立場。ヒカキンは批評対象。",
    flavor: "提唱: 【公式】ニコチンTV／別名: ニコチン主義",
    ideal: { trad: -45, rad: 55, exp: 70, lib: 25, dev: -40, gen: -30, sanc: 60, pol: 10, nare: 40 },
  },
  {
    id: "hikamer-fundamentalism",
    name: "ヒカマー原理主義",
    tags: "🟥",
    desc: "「ヒカマーであること」の純度と気概を重んじる立場。ただし本人いわく、原理主義者はあまり見かけない。",
    ideal: { trad: -30, rad: 75, exp: -55, lib: 0, dev: -50, gen: -40, sanc: 70, pol: 0, nare: -20 },
  },
  {
    id: "dai-hikamer",
    name: "大ヒカマー主義",
    tags: "🟥",
    desc: "ヒカマー界隈の拡大に積極的。・コスモ（普遍性を信じ布教）・帝国（非カマーを教化）・自由（来る者を拒まず去る者を追わない）の二次分類をすることが多い。",
    flavor: "提唱: 卑猥な三日月地帯 (@Hiwai_7)",
    ideal: { trad: -60, rad: 15, exp: 90, lib: 20, dev: -40, gen: -30, sanc: 0, pol: 10, nare: 40 },
  },
  {
    id: "sho-hikamer",
    name: "小ヒカマー主義",
    tags: "🟥",
    desc: "拡大に消極的で、異民族（ツイ廃など）・ノリチガ行為・一部の女ヒカマーや新参の排除を志向する。純度こそ正義。",
    ideal: { trad: -25, rad: 80, exp: -85, lib: -10, dev: -30, gen: -20, sanc: 80, pol: 10, nare: -30 },
  },
  {
    id: "post-hikamani",
    name: "ポストヒカマニ主義",
    tags: "🟥",
    desc: "ヒカマニ外伝や音MADの失速を受け、枠を超えて「ヒカキンの日常」や「ヒカマー界隈」を推し進めた思想運動。",
    flavor: "提唱: 卑猥な三日月地帯 (@Hiwai_7)",
    ideal: { trad: -85, rad: 55, exp: 65, lib: 15, dev: -40, gen: -60, sanc: 30, pol: 0, nare: 50 },
  },
  {
    id: "post-hikamer",
    name: "ポストヒカマー主義",
    tags: "🟩🟦",
    desc: "ヒカマー界隈のさらに先を模索する独自路線。ヒカマニ的素養を土台に、次の文化を探している。",
    ideal: { trad: -85, rad: -45, exp: 65, lib: 35, dev: -20, gen: -60, sanc: -20, pol: -10, nare: 40 },
  },
  {
    id: "hikanichism",
    name: "ヒカニチズム",
    tags: "🟩🟥",
    desc: "HIKAKINの動画素材とフリー素材で作る穏健なストーリー系MAD「ヒカニチ（ヒカキンの日常）」を界隈の中心に据える立場。大衆的で穏健。",
    ideal: { trad: -70, rad: -60, exp: 40, lib: -10, dev: 20, gen: -50, sanc: -40, pol: -40, nare: 20 },
  },
  {
    id: "inmer",
    name: "インマー",
    tags: "🟥",
    desc: "淫夢との混交を積極的に楽しむヒカマー。ノリは過激、縛りは少なめ、自由にやる。",
    ideal: { trad: -75, rad: 80, exp: 30, lib: 25, dev: -30, gen: -30, sanc: 20, pol: 0, nare: 30 },
  },
  // ===== 開發系 =====
  {
    id: "pro-kaihatsu",
    name: "親開發主義",
    tags: "🟦",
    desc: "開發家（ヒカキン一家）のコンテンツを積極的に支持し、その流れを歓迎する穏やかな立場。家族チャンネルも推せる。",
    ideal: { trad: 40, rad: -65, exp: 20, lib: -20, dev: 90, gen: 30, sanc: -50, pol: -40, nare: 10 },
  },
  {
    id: "anti-kaihatsu",
    name: "反開發主義",
    tags: "🟥",
    desc: "開發家中心の風潮に反発し、ヒカキン家の権威性と過去の失言に批判的に向き合う立場。開發叩きは娯楽であり戦い。",
    ideal: { trad: -50, rad: 65, exp: 20, lib: 20, dev: -90, gen: -30, sanc: 40, pol: 20, nare: -10 },
  },
  // ===== wiki系思想 =====
  {
    id: "hikamer-communism",
    name: "ヒカマー共産主義",
    tags: "",
    desc: "左派・護憲・反差別を軸に、露悪の矛先を弱者ではなく権力者や権威に向けようとする立場。",
    flavor: "提唱: チヌ／別名: マルクス＝レーニン＝チヌ主義",
    ideal: { trad: -55, rad: 45, exp: 60, lib: 45, dev: -50, gen: -40, sanc: 20, pol: 80, nare: 20 },
  },
  {
    id: "keisai-ism",
    name: "決済主義",
    tags: "",
    desc: "反規制思想を継承しつつ、「チー牛🤓」（権威主義・差別主義を内面化した弱者）への敵対を掲げる左派的ミーム思想。",
    flavor: "提唱: ヒカマーズ決済",
    ideal: { trad: -45, rad: 75, exp: 15, lib: 55, dev: -40, gen: -40, sanc: 50, pol: 70, nare: 0 },
  },
  {
    id: "muchitsujo-inmu-anarchism",
    name: "無秩序淫夢アナ、ゥキズム主義",
    tags: "",
    desc: "著作権も名誉毀損規制も、界隈の序列や自治も全部否定する、過激にして反秩序な思想。",
    flavor: "提唱: ヒカマーの唯一神／別名: 唯一神主義",
    ideal: { trad: -35, rad: 95, exp: 60, lib: 85, dev: -40, gen: -30, sanc: 40, pol: 20, nare: 20 },
  },
  {
    id: "hikamer-libertarianism",
    name: "ヒカマーズリバタリアニズム",
    tags: "",
    desc: "著作権廃止・AI推進・開示請求規制への反対を掲げつつ、帰属表示と弱者保護は守る自由主義思想。常識ある好儲主義。",
    flavor: "提唱: 十字架_mania／別名: 十字架主義",
    ideal: { trad: -40, rad: -5, exp: 75, lib: 95, dev: -30, gen: -20, sanc: -20, pol: 10, nare: 20 },
  },
  {
    id: "alqaeda-ism",
    name: "ヒカマーズアルカイダ主義",
    tags: "",
    desc: "うんこ・尿・グロテスク表現を、秩序攪乱のミームとして肯定する一大勢力。検索してはいけない言葉・危険度MAX。",
    flavor: "提唱: エッチキン／別名: ヒカアル主義、ホモウ主義",
    ideal: { trad: -55, rad: 95, exp: 55, lib: 70, dev: -50, gen: -40, sanc: 60, pol: -10, nare: 10 },
  },
  {
    id: "natto-ism",
    name: "ヒカマーズアルカイダ・納豆主義",
    tags: "",
    desc: "納豆に代表される奇食・ゲテモノ表現を、ショック系ミームの食文化版として位置づける流派。人数は少ないがインパクトは最大級。",
    flavor: "提唱: 名前募集bot、なっと、ゥ_mania",
    ideal: { trad: -30, rad: 85, exp: 25, lib: 35, dev: -20, gen: -20, sanc: 30, pol: -10, nare: 0 },
  },
  {
    id: "hikasei-ism",
    name: "ヒカ聖主義",
    tags: "",
    desc: "HIKAKINを道徳的な「聖人」として神格化する視点。炎上の少ない理想的存在として語るが、界隈では批判的に扱われる。",
    flavor: "別名: ヒカキン聖人主義、ヒカアノン主義",
    ideal: { trad: 30, rad: 15, exp: -40, lib: -60, dev: 70, gen: 30, sanc: -40, pol: -60, nare: -10 },
  },
  {
    id: "kaihatsu-ism",
    name: "開發主義",
    tags: "",
    desc: "放射能・食品安全・原発事故リスクへの強い警戒を、界隈が思想化した批判的呼称。「反原発主義」とも。",
    ideal: { trad: 15, rad: -60, exp: 20, lib: -45, dev: -20, gen: 0, sanc: -30, pol: -30, nare: -10 },
  },
  {
    id: "anti-natalism",
    name: "ヒカマーズ反出生主義",
    tags: "",
    desc: "弱者性や社会的競争への絶望を背景に、冷笑と距離取りを自己防衛として肯定する厭世的思想。",
    ideal: { trad: -20, rad: -45, exp: -55, lib: 15, dev: -10, gen: 0, sanc: -30, pol: -20, nare: -40 },
  },
  {
    id: "anti-hikamer",
    name: "反ヒカマー主義",
    tags: "",
    desc: "ヒカマーの露悪性や迷惑行為を、道徳・教育・公共性の観点から批判する立場。界隈の外側からの視線。",
    flavor: "提唱: 猿橋先生／別名: 猿橋主義",
    ideal: { trad: 45, rad: -75, exp: -90, lib: -85, dev: 60, gen: 50, sanc: -60, pol: -40, nare: -30 },
  },
  // ===== 勢力・人々（wikiカテゴリ「勢力」ほか） =====
  {
    id: "hikamani-people",
    name: "ヒカマニ民",
    tags: "",
    desc: "ヒカマニ外伝を愛好する保守派。ヒカキン聖人説を信じ、開發叩きや制裁、例のアレとの融合に消極的。自治厨的な文化も根強かった。",
    flavor: "ヒカマニ界隈の主流派／最古のヒカマニ民はマニアさん（2017〜2023）",
    ideal: { trad: 25, rad: -30, exp: -15, lib: -25, dev: 80, gen: 40, sanc: -40, pol: -50, nare: -10 },
  },
  {
    id: "hikanoon",
    name: "ヒカアノン",
    tags: "",
    desc: "ヒカキンの動画を普段見ていないのに、彼を極端に擁護する人々への蔑称。権威主義・弱者叩きの性質があり、左右どちらのヒカマーからも嫌われる。",
    flavor: "別名: 包ヒ民・ヒカキンナイト・ヒカ騎士／最初に使ったのはヒカマーズ決済",
    ideal: { trad: 20, rad: 20, exp: -35, lib: -70, dev: 80, gen: 30, sanc: 30, pol: -30, nare: -10 },
  },
  {
    id: "tsuihai-ochi",
    name: "ツイ廃堕ち",
    tags: "",
    desc: "ヒカマーから離れてツイ廃界隈に移行した人。裏切り者と見なされ、犯罪自慢やパクツイで稼ぐ者が多く、ヒカマーからも非カマーからも嫌われる。",
    flavor: "wiki「ツイ廃」: ツイ廃に移行する行為は「ツイ廃堕ち」と呼ばれる",
    ideal: { trad: -30, rad: 60, exp: 80, lib: 70, dev: -70, gen: -50, sanc: 50, pol: -10, nare: 60 },
  },
  {
    id: "jichichu",
    name: "自治厨",
    tags: "",
    desc: "自分ルールで他人を従わせる正義マン。界隈では「著作権の指摘」「制裁への反対」「反政治発言」「ヒカキン擁護」などが自治厨行為とされやすい。",
    flavor: "主な自治厨とされる界隈: ヒカマニ民・ヒカアノン",
    ideal: { trad: 40, rad: -70, exp: -60, lib: -80, dev: 20, gen: 30, sanc: -60, pol: -30, nare: -30 },
  },
  {
    id: "norichiga",
    name: "ノリチガ",
    tags: "",
    desc: "「ノリが違う」人の蔑称。批判されても改めず固執するほど嫌われるが、過度な認定は自治厨とされる諸刃の剣。ツイ廃発祥の言葉であることから改名運動もあり、対案は「シュールストレミング」「クセマー」。",
    ideal: { trad: 0, rad: -20, exp: -20, lib: -30, dev: 30, gen: -10, sanc: -20, pol: -20, nare: 40 },
  },
  {
    id: "otoma",
    name: "音マー",
    tags: "",
    desc: "音MAD作者。かつては「音マーにブロックされることがヒカマーの認定証」とされ、界隈における格式そのもの。神聖ないじり対象。",
    flavor: "※厳密には音MADを作る全員への呼称／さくれい主催「HikakinTV十年祭」合作はヒカキン本人が視聴・絶賛（2025）",
    ideal: { trad: 60, rad: 20, exp: -30, lib: 20, dev: 20, gen: 70, sanc: -10, pol: -30, nare: -30 },
  },
  {
    id: "gaiden-shokunin",
    name: "ヒカマニ外伝職人",
    tags: "🟦",
    desc: "ヒカマニ外伝を投稿し続ける職人。保守派の本丸で、動画サイトを拠点に長期的な作品を作り続ける。",
    ideal: { trad: 80, rad: 10, exp: -40, lib: -10, dev: 30, gen: 50, sanc: -20, pol: -30, nare: -20 },
  },
  {
    id: "hikanichi-shokunin",
    name: "ヒカニチ職人",
    tags: "🟩",
    desc: "ヒカニチ（ヒカキンの日常）系のストーリー動画を作る投稿者。穏健で大衆的、外伝職人とは別系統の作り手。",
    ideal: { trad: -60, rad: -50, exp: 30, lib: -20, dev: 40, gen: -40, sanc: -40, pol: -50, nare: 20 },
  },
  {
    id: "gijutsukei",
    name: "技術系ヒカマー",
    tags: "",
    desc: "Bot・サイト・サーバーを自作して界隈のインフラを支えるタイプ。レスバよりコミットで語り、ツールで愛を示す。",
    ideal: { trad: -20, rad: 0, exp: 60, lib: 60, dev: -10, gen: -10, sanc: -10, pol: -20, nare: 20 },
  },
  {
    id: "cyber-bu",
    name: "ヒカマーズサイバー部",
    tags: "",
    desc: "情報収集と開示を担うグループ。専用wikiを持ち、対象者の情報がまとめられることも。オフライン交流も確認されている。",
    ideal: { trad: -40, rad: 70, exp: 50, lib: 60, dev: -60, gen: -20, sanc: 80, pol: 10, nare: 0 },
  },
  {
    id: "donamers",
    name: "ドナマーズ帝国臣民",
    tags: "",
    desc: "荒らし集団「ドナマーズ」を中心とした帝国。公式アカで帝国ムーブを展開し、カードゲームではドナマニがSSR（排出率2%）として実装。特殊能力は「ドナマーズ制裁」。",
    flavor: "率いるのはドナマニ（@Donamani57）",
    ideal: { trad: -40, rad: 85, exp: 40, lib: 50, dev: -40, gen: -30, sanc: 90, pol: -10, nare: 30 },
  },
  {
    id: "azoku",
    name: "あ族",
    tags: "",
    desc: "2026年8月にカニあのパロディから生まれた集団。魚介＋「あ」の命名規則、挨拶は「よろ珍」。一過性の内輪ノリとして消滅しつつある。",
    ideal: { trad: -70, rad: -40, exp: 60, lib: 10, dev: -10, gen: -70, sanc: -50, pol: -50, nare: 80 },
  },
  {
    id: "osemer",
    name: "オセマー",
    tags: "",
    desc: "炎上系YouTuber「オセロ」をネタにするオセマニの愛好者。2024年に一大勢力として君臨したが、今は忘れられつつある。",
    ideal: { trad: -60, rad: 30, exp: 20, lib: 20, dev: -60, gen: -40, sanc: 30, pol: -20, nare: 20 },
  },
  {
    id: "botomer",
    name: "ボトマー",
    tags: "",
    desc: "特定対象への粘着をアイデンティティとする人々。偽装アカウントの運用や暴露騒動もあり、「ヒカマーの最底辺」と揶揄される。",
    ideal: { trad: -30, rad: 70, exp: 10, lib: 40, dev: -50, gen: -30, sanc: 70, pol: -10, nare: 30 },
  },
  {
    id: "meigenbot",
    name: "名言bot",
    tags: "",
    desc: "名言と無関係の不謹慎ツイートを垂れ流すbot群。全盛期は「不謹慎なツイート図鑑」に載ることが目的化した。現在は大半が衰退し、ヒカマーからも敵対されている。",
    ideal: { trad: -40, rad: 75, exp: -10, lib: 40, dev: -40, gen: -20, sanc: 30, pol: -30, nare: 10 },
  },
  {
    id: "neo-nazi-shineitai",
    name: "ネオナチ親衛隊",
    tags: "",
    desc: "ネオミド率いる過激派。ネオナチを自称し、若手を巻き込んだ騒動を繰り返してきた。ブルアカ界隈からも嫌われ、指導者は性加害の暴露で活動停止に追い込まれた。",
    ideal: { trad: 20, rad: 85, exp: -30, lib: -20, dev: -50, gen: 10, sanc: 85, pol: 70, nare: 20 },
  },
  {
    id: "digital-sekigun",
    name: "日本デジタル赤軍",
    tags: "",
    desc: "ヒカマー内戦を外から眺める勢力。赤軍BBSを拠点に動き、爆破予告文の送信などの騒動にも名前が上がった。",
    ideal: { trad: -20, rad: 85, exp: 20, lib: 40, dev: -50, gen: -20, sanc: 80, pol: 60, nare: 0 },
  },
  {
    id: "favonashi-kagekiha",
    name: "ファボなし過激派",
    tags: "",
    desc: "「空気を読めない人間は排除」する制裁クラスタの急先鋒。ファボなしRTの流れへの「いいね」は暗黙のタブーで、破れば制裁対象。みやま関連・「全部rawで見た」構文・ヒカアノン等が主な標的だが、磯野（@Isono_Kazumasa）のようにあえて逆張りする先駆けもいる。",
    ideal: { trad: 0, rad: 80, exp: -30, lib: 0, dev: -30, gen: 40, sanc: 75, pol: -10, nare: -40 },
  },
  {
    id: "hikakou-kenshou",
    name: "ヒカ恒兼任",
    tags: "",
    desc: "ヒカマーと恒心教徒を兼任する二重国籍勢。匿名文化とアングラの作法をわきまえ、炎上依頼や自語りなどのタブーを踏まない。",
    ideal: { trad: -20, rad: 80, exp: 10, lib: 50, dev: -40, gen: 0, sanc: 70, pol: -50, nare: -20 },
  },
  {
    id: "hikanichi-min",
    name: "ヒカニチ民",
    tags: "",
    desc: "ヒカニチや「開示だな」などライトな界隈コンテンツしか見ない層。ヒカキッズとほぼ同義になりつつあり、名称も流動的。",
    flavor: "呼称一覧: 名称候補「ヒカニチ民」「開示キッズ」",
    ideal: { trad: -55, rad: -60, exp: -20, lib: -30, dev: 50, gen: -40, sanc: -60, pol: -50, nare: 20 },
  },
  // ===== 属性・立場 =====
  {
    id: "rom-ma",
    name: "ROMマー",
    tags: "",
    desc: "アカウントは作らず・投稿せず、見るだけの人。最高の聴衆であり、最も安全な立場。",
    ideal: { trad: 0, rad: -40, exp: -60, lib: 0, dev: 10, gen: 10, sanc: -50, pol: -30, nare: -60 },
  },
  {
    id: "intai-ma",
    name: "引退マー",
    tags: "",
    desc: "失踪または円満に界隈を去った人。「引く時に引けた賢い人」は伝説になり、忘れた頃に復帰マーになる。",
    ideal: { trad: 10, rad: -30, exp: -50, lib: 0, dev: 10, gen: 20, sanc: -40, pol: -20, nare: -50 },
  },
  {
    id: "fukki-ma",
    name: "復帰マー",
    tags: "",
    desc: "一度引退したのに戻ってきた人。未練か、愛か。界隈は温かくも冷たくも迎える。",
    ideal: { trad: -10, rad: 10, exp: -20, lib: 10, dev: 0, gen: -10, sanc: -10, pol: -20, nare: 30 },
  },
  {
    id: "ai-generation",
    name: "AI生成勢",
    tags: "",
    desc: "AIでヒカマニコンテンツを量産するタイプ。肯定派と反AIの抗争の最前線にいる。あなたの作品、誰が作った？",
    ideal: { trad: -70, rad: 20, exp: 50, lib: 85, dev: -20, gen: -50, sanc: 0, pol: -20, nare: 20 },
  },
  {
    id: "kaigai-fukyou",
    name: "海外布教民",
    tags: "",
    desc: "翻訳や海外向け発信で界隈を世界へ広げる人。ヒカマーwikiには英語・中国語・韓国語の翻訳版が存在し、海外布教の実績が残る。",
    ideal: { trad: -30, rad: -20, exp: 90, lib: 40, dev: -10, gen: -20, sanc: -20, pol: -20, nare: 40 },
  },
  {
    id: "seichi-junrei",
    name: "聖地巡礼勢",
    tags: "",
    desc: "開発邸・野獣邸・ヒカマニ山・みやま市など、全国（と海外）に広がる「聖地」を実際に踏む人。けんまの作法をわきまえ、ギリギリのラインで楽しむ。",
    ideal: { trad: -10, rad: 50, exp: 30, lib: 20, dev: -20, gen: -10, sanc: 20, pol: -20, nare: 60 },
  },
  // ===== 一般 =====
  {
    id: "non-hikamer",
    name: "非カマー",
    tags: "",
    desc: "界隈に属さない一般ネットユーザー。この結果が出るのはむしろ希少。ようこそ、外の世界へ。",
    ideal: { trad: 0, rad: 0, exp: 0, lib: 0, dev: 0, gen: 0, sanc: 0, pol: 0, nare: 0 },
  },
];

/** 大ヒカマー主義の三次分類（結果表示用） */
export const DAI_HIKAMER_SUBTYPES = [
  {
    name: "コスモヒカマー主義",
    desc: "ヒカマーの普遍性を信じ、世界に広めようとする。",
    rad: -20,
    lib: 40,
  },
  {
    name: "ヒカマー帝国主義",
    desc: "非カマー勢力を教化しようとする。",
    rad: 50,
    lib: -10,
  },
  {
    name: "自由ヒカマー主義",
    desc: "来る者を拒まず、去る者を追わない。",
    rad: -35,
    lib: 30,
  },
] as const;
