// 流年（歳運）計算ロジック

import { Pillar, Ryunen } from '@/types';
import { STEM_KANJI } from '../constants/stems';
import { BRANCH_KANJI } from '../constants/branches';
import { getTsuhensei } from './tsuhensei';
import { getJuniUnsei } from './juniunsei';

/**
 * 流年干支を計算
 * @param year 西暦年
 */
export function getRyunenPillar(year: number): Pillar {
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 4) % 12 + 12) % 12;

  return {
    stemIndex,
    branchIndex,
    stem: STEM_KANJI[stemIndex],
    branch: BRANCH_KANJI[branchIndex],
  };
}

/**
 * 流年情報を計算
 * @param year 西暦年
 * @param birthYear 生年
 * @param dayStemIndex 日干インデックス
 */
export function calculateRyunen(
  year: number,
  birthYear: number,
  dayStemIndex: number
): Ryunen {
  const pillar = getRyunenPillar(year);
  const age = year - birthYear;

  return {
    year,
    age,
    pillar,
    tsuhensei: getTsuhensei(dayStemIndex, pillar.stemIndex),
    juniUnsei: getJuniUnsei(dayStemIndex, pillar.branchIndex),
  };
}

/**
 * 流年一覧を生成
 * @param startYear 開始年
 * @param endYear 終了年
 * @param birthYear 生年
 * @param dayStemIndex 日干インデックス
 */
export function generateRyunenList(
  startYear: number,
  endYear: number,
  birthYear: number,
  dayStemIndex: number
): Ryunen[] {
  const ryunenList: Ryunen[] = [];

  for (let year = startYear; year <= endYear; year++) {
    ryunenList.push(calculateRyunen(year, birthYear, dayStemIndex));
  }

  return ryunenList;
}

// 地支の相冲（衝突）関係
export const CHONG: Record<number, number> = {
  0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11,
  6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5
};

// 地支の支合（調和）関係
export const SHIGO: Record<number, number> = {
  0: 1,   // 子丑合
  1: 0,
  2: 11,  // 寅亥合
  11: 2,
  3: 10,  // 卯戌合
  10: 3,
  4: 9,   // 辰酉合
  9: 4,
  5: 8,   // 巳申合
  8: 5,
  6: 7,   // 午未合
  7: 6,
};

// 三合局
export const SANGOU: number[][] = [
  [8, 0, 4],   // 申子辰 = 水局
  [2, 6, 10],  // 寅午戌 = 火局
  [5, 9, 1],   // 巳酉丑 = 金局
  [11, 3, 7],  // 亥卯未 = 木局
];

// 方合
export const HOUGO: number[][] = [
  [11, 0, 1],  // 亥子丑 = 北方水局
  [2, 3, 4],   // 寅卯辰 = 東方木局
  [5, 6, 7],   // 巳午未 = 南方火局
  [8, 9, 10],  // 申酉戌 = 西方金局
];

/**
 * 相冲があるかチェック
 */
export function hasChong(branch1: number, branch2: number): boolean {
  return CHONG[branch1] === branch2;
}

/**
 * 支合があるかチェック
 */
export function hasShigo(branch1: number, branch2: number): boolean {
  return SHIGO[branch1] === branch2;
}
