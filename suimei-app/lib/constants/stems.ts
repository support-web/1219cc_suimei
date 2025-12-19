// 十干（天干）の定義

import { HeavenlyStem, Element, Polarity } from '@/types';

export const HEAVENLY_STEMS: HeavenlyStem[] = [
  { index: 0, kanji: '甲', reading: 'きのえ', element: 0, polarity: 0 },   // 木・陽
  { index: 1, kanji: '乙', reading: 'きのと', element: 0, polarity: 1 },   // 木・陰
  { index: 2, kanji: '丙', reading: 'ひのえ', element: 1, polarity: 0 },   // 火・陽
  { index: 3, kanji: '丁', reading: 'ひのと', element: 1, polarity: 1 },   // 火・陰
  { index: 4, kanji: '戊', reading: 'つちのえ', element: 2, polarity: 0 }, // 土・陽
  { index: 5, kanji: '己', reading: 'つちのと', element: 2, polarity: 1 }, // 土・陰
  { index: 6, kanji: '庚', reading: 'かのえ', element: 3, polarity: 0 },   // 金・陽
  { index: 7, kanji: '辛', reading: 'かのと', element: 3, polarity: 1 },   // 金・陰
  { index: 8, kanji: '壬', reading: 'みずのえ', element: 4, polarity: 0 }, // 水・陽
  { index: 9, kanji: '癸', reading: 'みずのと', element: 4, polarity: 1 }, // 水・陰
];

// 天干の漢字配列
export const STEM_KANJI = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 天干インデックスから五行インデックスを取得
export function getStemElement(stemIndex: number): Element {
  return Math.floor(stemIndex / 2) as Element;
}

// 天干インデックスから陰陽を取得
export function getStemPolarity(stemIndex: number): Polarity {
  return (stemIndex % 2) as Polarity;
}

// 天干の漢字からインデックスを取得
export function getStemIndex(kanji: string): number {
  return STEM_KANJI.indexOf(kanji);
}
