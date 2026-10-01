/**
 * ヒカマーズ8values 診断結果（イデオロギー）データ
 * 出自: @Hiwai_7 の「ヒカマーズ思想」「ヒカマニ思想一覧」「ヒカマーズグラフ」、
 *       ヒカマーwiki「ヒカマー界隈のイデオロギー一覧」(/wiki/イデオロギー)
 * ideal: 各軸の理想値(-100〜100)。+trad=伝統 / +rad=過激 / +exp=拡大 / +lib=自由
 */

export interface Ideology {
  id: string;
  name: string;
  /** 思想一覧で使われているマーカー (🟦 ヒカマニ的 / 🟥 ヒカマー的 / 🟩 独自路線) */
  tags: string;
  desc: string;
  /** 提唱者・別名などの補足 */
  flavor?: string;
  ideal: { trad: number; rad: number; exp: number; lib: number };
}

export const IDEOLOGIES: Ideology[] = [
  {
    id: "hikamani-fundamentalism",
    name: "ヒカマニ原理主義",
    tags: "🟦",
    desc: "ヒカマニを内輪の音MAD文化として保守し、淫夢や例のアレとの混交に否定的な立場。文脈の純度と界隈の境界を重んじる。",
    flavor: "別名: ヒカマニ保守主義・ヒカマニ民思想",
    ideal: { trad: 75, rad: 30, exp: -65, lib: -10 },
  },
  {
    id: "hikamani-classicism",
    name: "ヒカマニ古典主義",
    tags: "🟦",
    desc: "往年の外伝・音MAD・名作ネタを「古典」として尊び、新作より再評価を進める立場。教養として後世に残したい。",
    ideal: { trad: 70, rad: -35, exp: -25, lib: -15 },
  },
  {
    id: "primitive-hikamani",
    name: "原始ヒカマニ主義",
    tags: "🟩🟦",
    desc: "黎明期ヒカマニの空気と純度への回帰を求める原始回帰派。最初期の投稿・素材・ノリに理想を見る。",
    ideal: { trad: 90, rad: 40, exp: -70, lib: 10 },
  },
  {
    id: "dai-hikamani",
    name: "大ヒカマニ主義",
    tags: "🟥🟦",
    desc: "ヒカマニを開かれた文化として、穏健に拡大していく立場。混交も拡張も前向きに捉える。",
    ideal: { trad: 20, rad: -35, exp: 80, lib: 10 },
  },
  {
    id: "sho-hikamani",
    name: "小ヒカマニ主義",
    tags: "🟦",
    desc: "拡大に消極的で、身内のヒカマニ文化を静かに大切にする立場。外に開くより、内側の厚みを取る。",
    ideal: { trad: 50, rad: 20, exp: -80, lib: -15 },
  },
  {
    id: "hikamer-ism",
    name: "ヒカマー主義",
    tags: "🟥",
    desc: "ヒカマニと例のアレ・淫夢の接続を肯定し、風刺的二次創作と界隈拡張を推す源流的立場。ヒカキンは批評対象。",
    flavor: "提唱: 【公式】ニコチンTV／別名: ニコチン主義",
    ideal: { trad: -45, rad: 55, exp: 70, lib: 25 },
  },
  {
    id: "hikamer-fundamentalism",
    name: "ヒカマー原理主義",
    tags: "🟥",
    desc: "「ヒカマーであること」の純度と気概を重んじる立場。ただし本人いわく、原理主義者はあまり見かけない。",
    ideal: { trad: -30, rad: 75, exp: -55, lib: 0 },
  },
  {
    id: "dai-hikamer",
    name: "大ヒカマー主義",
    tags: "🟥",
    desc: "ヒカマー界隈の拡大に積極的。・コスモ（普遍性を信じ布教）・帝国（非カマーを教化）・自由（来る者を拒まず去る者を追わない）の三次分類がある。",
    flavor: "提唱: 卑猥な三日月地帯 (@Hiwai_7)",
    ideal: { trad: -60, rad: 15, exp: 90, lib: 20 },
  },
  {
    id: "sho-hikamer",
    name: "小ヒカマー主義",
    tags: "🟥",
    desc: "拡大に消極的で、異民族（ツイ廃など）・ノリチガ行為・一部の女ヒカマーや新参の排除を志向する。純度こそ正義。",
    ideal: { trad: -25, rad: 80, exp: -85, lib: -10 },
  },
  {
    id: "post-hikamani",
    name: "ポストヒカマニ主義",
    tags: "🟥",
    desc: "ヒカマニ外伝や音MADの失速を受け、枠を超えて「ヒカキンの日常」や「ヒカマー界隈」を推し進めた思想運動。",
    flavor: "提唱: 卑猥な三日月地帯 (@Hiwai_7)",
    ideal: { trad: -85, rad: 55, exp: 65, lib: 15 },
  },
  {
    id: "post-hikamer",
    name: "ポストヒカマー主義",
    tags: "🟩🟦",
    desc: "ヒカマー界隈のさらに先を模索する独自路線。ヒカマニ的素養を土台に、次の文化を探している。",
    ideal: { trad: -85, rad: -45, exp: 65, lib: 35 },
  },
  {
    id: "hikanichism",
    name: "ヒカニチズム",
    tags: "🟩🟥",
    desc: "「ヒカキンの日常（ヒカニチ）」を界隈の中心に据える立場。大衆的で穏健、誰にでも薦められる。",
    ideal: { trad: -70, rad: -60, exp: 40, lib: -10 },
  },
  {
    id: "inmer",
    name: "インマー",
    tags: "🟥",
    desc: "淫夢との混交を積極的に楽しむヒカマー。ノリは過激、縛りは少なめ、自由にやる。",
    ideal: { trad: -75, rad: 80, exp: 30, lib: 25 },
  },
  {
    id: "pro-kaihatsu",
    name: "親開發主義",
    tags: "🟦",
    desc: "開發家（ヒカキン一家）のコンテンツを積極的に支持し、その流れを歓迎する穏やかな立場。",
    ideal: { trad: 40, rad: -65, exp: 20, lib: -20 },
  },
  {
    id: "anti-kaihatsu",
    name: "反開發主義",
    tags: "🟥",
    desc: "開發家中心の風潮に反発し、ヒカキン家の権威性に批判的に向き合う立場。",
    ideal: { trad: -50, rad: 65, exp: 20, lib: 20 },
  },
  {
    id: "hikamer-communism",
    name: "ヒカマー共産主義",
    tags: "",
    desc: "左派・護憲・反差別を軸に、露悪の矛先を弱者ではなく権力者や権威に向けようとする立場。",
    flavor: "提唱: チヌ／別名: マルクス＝レーニン＝チヌ主義",
    ideal: { trad: -55, rad: 45, exp: 60, lib: 45 },
  },
  {
    id: "keisai-ism",
    name: "決済主義",
    tags: "",
    desc: "反規制思想を継承しつつ、「チー牛🤓」（権威主義・差別主義を内面化した弱者）への敵対を掲げる左派的ミーム思想。",
    flavor: "提唱: ヒカマーズ決済",
    ideal: { trad: -45, rad: 75, exp: 15, lib: 55 },
  },
  {
    id: "muchitsujo-inmu-anarchism",
    name: "無秩序淫夢アナ、ゥキズム主義",
    tags: "",
    desc: "著作権も名誉毀損規制も、界隈の序列や自治も全部否定する、過激にして反秩序な思想。",
    flavor: "提唱: ヒカマーの唯一神／別名: 唯一神主義",
    ideal: { trad: -35, rad: 95, exp: 60, lib: 85 },
  },
  {
    id: "hikamer-libertarianism",
    name: "ヒカマーズリバタリアニズム",
    tags: "",
    desc: "著作権廃止・AI推進・開示請求規制への反対を掲げつつ、帰属表示と弱者保護は守る自由主義思想。常識ある好儲主義。",
    flavor: "提唱: 十字架_mania／別名: 十字架主義",
    ideal: { trad: -40, rad: -5, exp: 75, lib: 95 },
  },
  {
    id: "alqaeda-ism",
    name: "ヒカマーズアルカイダ主義",
    tags: "",
    desc: "うんこ・尿・グロテスク表現を、秩序攪乱のミームとして肯定する一大勢力。検索してはいけない言葉・危険度MAX。",
    flavor: "提唱: エッチキン／別名: ヒカアル主義、ホモウ主義",
    ideal: { trad: -55, rad: 95, exp: 55, lib: 70 },
  },
  {
    id: "natto-ism",
    name: "ヒカマーズアルカイダ・納豆主義",
    tags: "",
    desc: "納豆に代表される奇食・ゲテモノ表現を、ショック系ミームの食文化版として位置づける流派。人数は少ないがインパクトは最大級。",
    flavor: "提唱: 名前募集bot、なっと、ゥ_mania",
    ideal: { trad: -30, rad: 85, exp: 25, lib: 35 },
  },
  {
    id: "hikasei-ism",
    name: "ヒカ聖主義",
    tags: "",
    desc: "HIKAKINを道徳的な「聖人」として神格化する視点。炎上の少ない理想的存在として語るが、界隈では批判的に扱われる。",
    flavor: "別名: ヒカキン聖人主義、ヒカアノン主義",
    ideal: { trad: 30, rad: 15, exp: -40, lib: -60 },
  },
  {
    id: "kaihatsu-ism",
    name: "開發主義",
    tags: "",
    desc: "放射能・食品安全・原発事故リスクへの強い警戒を、界隈が思想化した批判的呼称。「反原発主義」とも。",
    ideal: { trad: 15, rad: -60, exp: 20, lib: -45 },
  },
  {
    id: "anti-natalism",
    name: "ヒカマーズ反出生主義",
    tags: "",
    desc: "弱者性や社会的競争への絶望を背景に、冷笑と距離取りを自己防衛として肯定する厭世的思想。",
    ideal: { trad: -20, rad: -45, exp: -55, lib: 15 },
  },
  {
    id: "anti-hikamer",
    name: "反ヒカマー主義",
    tags: "",
    desc: "ヒカマーの露悪性や迷惑行為を、道徳・教育・公共性の観点から批判する立場。界隈の外側からの視線。",
    flavor: "提唱: 猿橋先生／別名: 猿橋主義",
    ideal: { trad: 45, rad: -75, exp: -90, lib: -85 },
  },
  {
    id: "hikamani-people",
    name: "ヒカマニ民",
    tags: "",
    desc: "ヒカマニは見るが、界隈のノリには深入りしない。ヒカキンを純粋に楽しむ穏やかな視聴者層。あなたは平和な人だ。",
    ideal: { trad: 25, rad: -30, exp: -15, lib: -25 },
  },
  {
    id: "non-hikamer",
    name: "非カマー",
    tags: "",
    desc: "界隈に属さない一般ネットユーザー。この結果が出るのはむしろ希少。ようこそ、外の世界へ。",
    ideal: { trad: 50, rad: 50, exp: 50, lib: 50 },
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
