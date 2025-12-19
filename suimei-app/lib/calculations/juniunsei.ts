// 十二運星計算ロジック

import { JuniUnSei } from '@/types';

// 十二運星の順序
export const JUNIUNSEI_ORDER: JuniUnSei[] = [
  '長生', '沐浴', '冠帯', '建禄', '帝旺',
  '衰', '病', '死', '墓', '絶', '胎', '養'
];

// 各天干の長生の地支インデックスと方向
const CHOUSHOU_CONFIG: Record<number, { branch: number; direction: 'forward' | 'backward' }> = {
  0: { branch: 11, direction: 'forward' },  // 甲 - 亥から順行
  1: { branch: 6, direction: 'backward' },  // 乙 - 午から逆行
  2: { branch: 2, direction: 'forward' },   // 丙 - 寅から順行
  3: { branch: 9, direction: 'backward' },  // 丁 - 酉から逆行
  4: { branch: 2, direction: 'forward' },   // 戊 - 寅から順行
  5: { branch: 9, direction: 'backward' },  // 己 - 酉から逆行
  6: { branch: 5, direction: 'forward' },   // 庚 - 巳から順行
  7: { branch: 0, direction: 'backward' },  // 辛 - 子から逆行
  8: { branch: 8, direction: 'forward' },   // 壬 - 申から順行
  9: { branch: 3, direction: 'backward' },  // 癸 - 卯から逆行
};

/**
 * 十二運星を計算
 * @param stemIndex 天干インデックス
 * @param branchIndex 地支インデックス
 */
export function getJuniUnsei(stemIndex: number, branchIndex: number): JuniUnSei {
  const config = CHOUSHOU_CONFIG[stemIndex];
  const { branch: choushouBranch, direction } = config;

  let diff: number;
  if (direction === 'forward') {
    diff = ((branchIndex - choushouBranch) % 12 + 12) % 12;
  } else {
    diff = ((choushouBranch - branchIndex) % 12 + 12) % 12;
  }

  return JUNIUNSEI_ORDER[diff];
}

// 十二運星対応表（10×12マトリクス）- 高速参照用
export const JUNIUNSEI_TABLE: Record<string, Record<string, JuniUnSei>> = {
  '甲': { '子': '沐浴', '丑': '冠帯', '寅': '建禄', '卯': '帝旺', '辰': '衰', '巳': '病', '午': '死', '未': '墓', '申': '絶', '酉': '胎', '戌': '養', '亥': '長生' },
  '乙': { '子': '病', '丑': '衰', '寅': '帝旺', '卯': '建禄', '辰': '冠帯', '巳': '沐浴', '午': '長生', '未': '養', '申': '胎', '酉': '絶', '戌': '墓', '亥': '死' },
  '丙': { '子': '胎', '丑': '養', '寅': '長生', '卯': '沐浴', '辰': '冠帯', '巳': '建禄', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '絶' },
  '丁': { '子': '絶', '丑': '墓', '寅': '死', '卯': '病', '辰': '衰', '巳': '帝旺', '午': '建禄', '未': '冠帯', '申': '沐浴', '酉': '長生', '戌': '養', '亥': '胎' },
  '戊': { '子': '胎', '丑': '養', '寅': '長生', '卯': '沐浴', '辰': '冠帯', '巳': '建禄', '午': '帝旺', '未': '衰', '申': '病', '酉': '死', '戌': '墓', '亥': '絶' },
  '己': { '子': '絶', '丑': '墓', '寅': '死', '卯': '病', '辰': '衰', '巳': '帝旺', '午': '建禄', '未': '冠帯', '申': '沐浴', '酉': '長生', '戌': '養', '亥': '胎' },
  '庚': { '子': '死', '丑': '墓', '寅': '絶', '卯': '胎', '辰': '養', '巳': '長生', '午': '沐浴', '未': '冠帯', '申': '建禄', '酉': '帝旺', '戌': '衰', '亥': '病' },
  '辛': { '子': '長生', '丑': '養', '寅': '胎', '卯': '絶', '辰': '墓', '巳': '死', '午': '病', '未': '衰', '申': '帝旺', '酉': '建禄', '戌': '冠帯', '亥': '沐浴' },
  '壬': { '子': '帝旺', '丑': '衰', '寅': '病', '卯': '死', '辰': '墓', '巳': '絶', '午': '胎', '未': '養', '申': '長生', '酉': '沐浴', '戌': '冠帯', '亥': '建禄' },
  '癸': { '子': '建禄', '丑': '冠帯', '寅': '沐浴', '卯': '長生', '辰': '養', '巳': '胎', '午': '絶', '未': '墓', '申': '死', '酉': '病', '戌': '衰', '亥': '帝旺' },
};

/**
 * テーブル参照による高速な十二運星取得
 * @param stemKanji 天干の漢字
 * @param branchKanji 地支の漢字
 */
export function getJuniUnseiByKanji(stemKanji: string, branchKanji: string): JuniUnSei {
  return JUNIUNSEI_TABLE[stemKanji][branchKanji];
}

// 十二運星のエネルギー値
export const JUNIUNSEI_ENERGY: Record<JuniUnSei, number> = {
  '帝旺': 12,
  '建禄': 11,
  '冠帯': 10,
  '長生': 9,
  '衰': 8,
  '沐浴': 7,
  '養': 6,
  '墓': 5,
  '病': 4,
  '胎': 3,
  '死': 2,
  '絶': 1,
};

// 十二運星の強弱分類
export const JUNIUNSEI_STRENGTH: Record<JuniUnSei, '強' | '並' | '弱'> = {
  '帝旺': '強',
  '建禄': '強',
  '冠帯': '強',
  '長生': '並',
  '衰': '並',
  '沐浴': '並',
  '養': '並',
  '墓': '並',
  '病': '弱',
  '胎': '弱',
  '死': '弱',
  '絶': '弱',
};

// 十二運星の読み方
export const JUNIUNSEI_READINGS: Record<JuniUnSei, string> = {
  '長生': 'ちょうせい',
  '沐浴': 'もくよく',
  '冠帯': 'かんたい',
  '建禄': 'けんろく',
  '帝旺': 'ていおう',
  '衰': 'すい',
  '病': 'びょう',
  '死': 'し',
  '墓': 'ぼ',
  '絶': 'ぜつ',
  '胎': 'たい',
  '養': 'よう',
};

// 十二運星の簡易説明
export const JUNIUNSEI_DESCRIPTIONS: Record<JuniUnSei, string> = {
  '長生': '誕生、成長の始まり、発展',
  '沐浴': '若さ、不安定、華やかさ',
  '冠帯': '成人、独立、活動開始',
  '建禄': '安定、充実、実力発揮',
  '帝旺': '最高潮、権力、ピーク',
  '衰': '下降、経験蓄積、安定志向',
  '病': '弱体、内省、精神的成長',
  '死': '終焉、リセット、変化',
  '墓': '貯蔵、準備、潜在力',
  '絶': '無、虚無、可能性の種',
  '胎': '宿る、計画、始まりの予兆',
  '養': '育成、準備期間、保護下',
};
