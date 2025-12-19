// 五行の定義

import { Element, ElementName } from '@/types';

// 五行
export const FIVE_ELEMENTS: { index: Element; kanji: ElementName; reading: string; generates: Element; controls: Element }[] = [
  { index: 0, kanji: '木', reading: 'もく', generates: 1, controls: 2 },
  { index: 1, kanji: '火', reading: 'か', generates: 2, controls: 3 },
  { index: 2, kanji: '土', reading: 'ど', generates: 3, controls: 4 },
  { index: 3, kanji: '金', reading: 'きん', generates: 4, controls: 0 },
  { index: 4, kanji: '水', reading: 'すい', generates: 0, controls: 1 },
];

export const ELEMENT_NAMES: ElementName[] = ['木', '火', '土', '金', '水'];

// 五行の色
export const ELEMENT_COLORS: Record<ElementName, string> = {
  '木': '#4CAF50', // 緑
  '火': '#F44336', // 赤
  '土': '#FFC107', // 黄
  '金': '#9E9E9E', // 灰/白
  '水': '#2196F3', // 青
};

// 相生（生じる関係）: 木→火→土→金→水→木
export function isGenerating(element1: Element, element2: Element): boolean {
  return (element1 + 1) % 5 === element2;
}

// 相剋（剋す関係）: 木→土→水→火→金→木
export function isControlling(element1: Element, element2: Element): boolean {
  return (element1 + 2) % 5 === element2;
}

// 相生される関係
export function isGenerated(element1: Element, element2: Element): boolean {
  return isGenerating(element2, element1);
}

// 相剋される関係
export function isControlled(element1: Element, element2: Element): boolean {
  return isControlling(element2, element1);
}

// 五行の関係を取得
export type ElementRelation = 'same' | 'generating' | 'generated' | 'controlling' | 'controlled';

export function getElementRelation(from: Element, to: Element): ElementRelation {
  if (from === to) return 'same';
  if (isGenerating(from, to)) return 'generating';
  if (isGenerated(from, to)) return 'generated';
  if (isControlling(from, to)) return 'controlling';
  return 'controlled';
}
