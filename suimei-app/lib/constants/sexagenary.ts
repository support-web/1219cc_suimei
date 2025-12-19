// 六十干支の定義

import { STEM_KANJI } from './stems';
import { BRANCH_KANJI } from './branches';

// 六十干支の配列
export const SIXTY_KANSHI: string[] = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

// 天干・地支インデックスから六十干支番号を計算
export function getSexagenaryIndex(stemIndex: number, branchIndex: number): number {
  let k = 6 * stemIndex - 5 * branchIndex;
  return ((k % 60) + 60) % 60;
}

// 六十干支番号から天干・地支インデックスを取得
export function getStemBranchFromIndex(num: number): { stemIndex: number; branchIndex: number } {
  const normalizedNum = ((num % 60) + 60) % 60;
  const stemIndex = normalizedNum % 10;
  const branchIndex = normalizedNum % 12;
  return { stemIndex, branchIndex };
}

// 六十干支の文字列を取得
export function getKanshi(stemIndex: number, branchIndex: number): string {
  return STEM_KANJI[stemIndex] + BRANCH_KANJI[branchIndex];
}

// 六十干支の文字列からインデックスを取得
export function getKanshiIndex(kanshi: string): number {
  return SIXTY_KANSHI.indexOf(kanshi);
}
