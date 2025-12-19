// 十二支（地支）の定義

import { EarthlyBranch, Element, Polarity } from '@/types';

export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  {
    index: 0, kanji: '子', reading: 'ね', element: 4, polarity: 0,
    hiddenStems: [9], hiddenStemsWeights: [100],
    hourRange: '23:00-01:00'
  },
  {
    index: 1, kanji: '丑', reading: 'うし', element: 2, polarity: 1,
    hiddenStems: [5, 9, 7], hiddenStemsWeights: [60, 30, 10],
    hourRange: '01:00-03:00'
  },
  {
    index: 2, kanji: '寅', reading: 'とら', element: 0, polarity: 0,
    hiddenStems: [0, 2, 4], hiddenStemsWeights: [60, 30, 10],
    hourRange: '03:00-05:00'
  },
  {
    index: 3, kanji: '卯', reading: 'う', element: 0, polarity: 1,
    hiddenStems: [1], hiddenStemsWeights: [100],
    hourRange: '05:00-07:00'
  },
  {
    index: 4, kanji: '辰', reading: 'たつ', element: 2, polarity: 0,
    hiddenStems: [4, 1, 9], hiddenStemsWeights: [60, 30, 10],
    hourRange: '07:00-09:00'
  },
  {
    index: 5, kanji: '巳', reading: 'み', element: 1, polarity: 1,
    hiddenStems: [2, 6, 4], hiddenStemsWeights: [60, 30, 10],
    hourRange: '09:00-11:00'
  },
  {
    index: 6, kanji: '午', reading: 'うま', element: 1, polarity: 0,
    hiddenStems: [3, 5], hiddenStemsWeights: [70, 30],
    hourRange: '11:00-13:00'
  },
  {
    index: 7, kanji: '未', reading: 'ひつじ', element: 2, polarity: 1,
    hiddenStems: [5, 3, 1], hiddenStemsWeights: [60, 30, 10],
    hourRange: '13:00-15:00'
  },
  {
    index: 8, kanji: '申', reading: 'さる', element: 3, polarity: 0,
    hiddenStems: [6, 8, 4], hiddenStemsWeights: [60, 30, 10],
    hourRange: '15:00-17:00'
  },
  {
    index: 9, kanji: '酉', reading: 'とり', element: 3, polarity: 1,
    hiddenStems: [7], hiddenStemsWeights: [100],
    hourRange: '17:00-19:00'
  },
  {
    index: 10, kanji: '戌', reading: 'いぬ', element: 2, polarity: 0,
    hiddenStems: [4, 7, 3], hiddenStemsWeights: [60, 30, 10],
    hourRange: '19:00-21:00'
  },
  {
    index: 11, kanji: '亥', reading: 'い', element: 4, polarity: 1,
    hiddenStems: [8, 0], hiddenStemsWeights: [70, 30],
    hourRange: '21:00-23:00'
  },
];

// 地支の漢字配列
export const BRANCH_KANJI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 地支の五行配列（インデックスで取得用）
export const BRANCH_ELEMENTS: Element[] = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

// 地支の漢字からインデックスを取得
export function getBranchIndex(kanji: string): number {
  return BRANCH_KANJI.indexOf(kanji);
}

// 地支インデックスから五行を取得
export function getBranchElement(branchIndex: number): Element {
  return BRANCH_ELEMENTS[branchIndex];
}

// 時刻から時支インデックスを取得
export function getHourBranch(hour: number): number {
  if (hour >= 23 || hour < 1) return 0;  // 子
  if (hour < 3) return 1;   // 丑
  if (hour < 5) return 2;   // 寅
  if (hour < 7) return 3;   // 卯
  if (hour < 9) return 4;   // 辰
  if (hour < 11) return 5;  // 巳
  if (hour < 13) return 6;  // 午
  if (hour < 15) return 7;  // 未
  if (hour < 17) return 8;  // 申
  if (hour < 19) return 9;  // 酉
  if (hour < 21) return 10; // 戌
  return 11; // 亥
}
