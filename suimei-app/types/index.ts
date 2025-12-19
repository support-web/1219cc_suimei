// 四柱推命の型定義

// 五行
export type Element = 0 | 1 | 2 | 3 | 4; // 木=0, 火=1, 土=2, 金=3, 水=4
export type ElementName = '木' | '火' | '土' | '金' | '水';

// 陰陽
export type Polarity = 0 | 1; // 陽=0, 陰=1
export type PolarityName = '陽' | '陰';

// 天干
export interface HeavenlyStem {
  index: number;
  kanji: string;
  reading: string;
  element: Element;
  polarity: Polarity;
}

// 地支
export interface EarthlyBranch {
  index: number;
  kanji: string;
  reading: string;
  element: Element;
  polarity: Polarity;
  hiddenStems: number[]; // 蔵干のインデックス（本気、中気、余気の順）
  hiddenStemsWeights: number[]; // 蔵干の重み
  hourRange: string; // 時刻範囲
}

// 柱
export interface Pillar {
  stemIndex: number;
  branchIndex: number;
  stem: string;
  branch: string;
}

// 通変星
export type TsuhenSei =
  | '比肩' | '劫財'
  | '食神' | '傷官'
  | '偏財' | '正財'
  | '偏官' | '正官'
  | '偏印' | '印綬';

// 十二運星
export type JuniUnSei =
  | '長生' | '沐浴' | '冠帯' | '建禄' | '帝旺'
  | '衰' | '病' | '死' | '墓' | '絶' | '胎' | '養';

// 命式
export interface Meishiki {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;

  // 通変星
  tsuhensei: {
    year: TsuhenSei;
    month: TsuhenSei;
    hour: TsuhenSei | null;
  };

  // 十二運星
  juniUnsei: {
    year: JuniUnSei;
    month: JuniUnSei;
    day: JuniUnSei;
    hour: JuniUnSei | null;
  };

  // 蔵干通変星
  zokanTsuhensei: {
    year: TsuhenSei[];
    month: TsuhenSei[];
    day: TsuhenSei[];
    hour: TsuhenSei[] | null;
  };
}

// 大運
export interface Daiun {
  startAge: number;
  endAge: number;
  pillar: Pillar;
  tsuhensei: TsuhenSei;
  juniUnsei: JuniUnSei;
}

// 流年
export interface Ryunen {
  year: number;
  age: number;
  pillar: Pillar;
  tsuhensei: TsuhenSei;
  juniUnsei: JuniUnSei;
}

// 運勢スコア
export interface FortuneScore {
  overall: number;
  money: number;
  love: number;
  work: number;
  health: number;
}

// 入力データ
export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number | null;
  gender: 'male' | 'female';
  timezone: string;
}

// 身強・身弱
export type DayMasterStrength = 'strong' | 'weak';

// 喜神・忌神
export interface KishinGishin {
  kishin: TsuhenSei[];
  gishin: TsuhenSei[];
}

// 大運方向
export type DaiunDirection = 'forward' | 'backward';

// 立運年齢
export interface RitsunAge {
  years: number;
  months: number;
}

// 完全な命式データ
export interface FullMeishiki extends Meishiki {
  birthData: BirthData;
  dayMasterStrength: DayMasterStrength;
  kishinGishin: KishinGishin;
  daiunDirection: DaiunDirection;
  ritsunAge: RitsunAge;
  daiun: Daiun[];
}

// 運勢タイムライン
export interface FortuneTimeline {
  year: number;
  age: number;
  daiun: {
    pillar: Pillar;
    period: string;
  };
  ryunen: {
    pillar: Pillar;
  };
  scores: FortuneScore;
}
