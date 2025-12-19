// 大運計算ロジック

import { Pillar, Daiun, DaiunDirection, RitsunAge } from '@/types';
import { STEM_KANJI } from '../constants/stems';
import { BRANCH_KANJI } from '../constants/branches';
import { SIXTY_KANSHI, getSexagenaryIndex } from '../constants/sexagenary';
import { getTsuhensei } from './tsuhensei';
import { getJuniUnsei } from './juniunsei';

/**
 * 大運の順行・逆行を判定
 * @param gender 性別 ('male' | 'female')
 * @param yearStemIndex 年干インデックス
 */
export function getDaiunDirection(
  gender: 'male' | 'female',
  yearStemIndex: number
): DaiunDirection {
  const isYangStem = yearStemIndex % 2 === 0;
  const isMale = gender === 'male';

  // 男命＋陽干 or 女命＋陰干 → 順行
  // 男命＋陰干 or 女命＋陽干 → 逆行
  return (isMale === isYangStem) ? 'forward' : 'backward';
}

/**
 * 立運年齢（大運開始年齢）を計算
 * @param birthDate 生年月日
 * @param direction 大運の方向
 * @param nextJieDate 次の節入り日時（順行時）
 * @param prevJieDate 前の節入り日時（逆行時）
 */
export function calculateRitsunAge(
  birthDate: Date,
  direction: DaiunDirection,
  nextJieDate: Date,
  prevJieDate: Date
): RitsunAge {
  let targetDate: Date;

  if (direction === 'forward') {
    // 順行：次の節入り日までの日数
    targetDate = nextJieDate;
  } else {
    // 逆行：前の節入り日までの日数
    targetDate = prevJieDate;
  }

  const daysDiff = Math.abs(Math.floor(
    (targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  ));

  // 3日 = 1年、余り1日 = 4ヶ月
  const years = Math.floor(daysDiff / 3);
  const remainderDays = daysDiff % 3;
  const months = remainderDays * 4;

  return { years, months };
}

/**
 * 大運干支を計算
 * @param monthPillar 月柱
 * @param direction 大運の方向
 * @param daiunNumber 第何大運か（1, 2, 3...）
 */
export function getDaiunPillar(
  monthPillar: Pillar,
  direction: DaiunDirection,
  daiunNumber: number
): Pillar {
  const monthKanshiIndex = getSexagenaryIndex(monthPillar.stemIndex, monthPillar.branchIndex);

  let daiunIndex: number;
  if (direction === 'forward') {
    daiunIndex = (monthKanshiIndex + daiunNumber) % 60;
  } else {
    daiunIndex = ((monthKanshiIndex - daiunNumber) % 60 + 60) % 60;
  }

  const stemIndex = daiunIndex % 10;
  const branchIndex = daiunIndex % 12;

  return {
    stemIndex,
    branchIndex,
    stem: STEM_KANJI[stemIndex],
    branch: BRANCH_KANJI[branchIndex],
  };
}

/**
 * 大運一覧を生成
 * @param monthPillar 月柱
 * @param dayPillar 日柱
 * @param direction 大運の方向
 * @param ritsunAge 立運年齢
 * @param count 大運の数（デフォルト10）
 */
export function generateDaiunList(
  monthPillar: Pillar,
  dayPillar: Pillar,
  direction: DaiunDirection,
  ritsunAge: RitsunAge,
  count: number = 10
): Daiun[] {
  const daiunList: Daiun[] = [];

  for (let i = 1; i <= count; i++) {
    const pillar = getDaiunPillar(monthPillar, direction, i);
    const startAge = ritsunAge.years + (i - 1) * 10;
    const endAge = startAge + 9;

    daiunList.push({
      startAge,
      endAge,
      pillar,
      tsuhensei: getTsuhensei(dayPillar.stemIndex, pillar.stemIndex),
      juniUnsei: getJuniUnsei(dayPillar.stemIndex, pillar.branchIndex),
    });
  }

  return daiunList;
}

/**
 * 指定年齢の大運を取得
 * @param daiunList 大運リスト
 * @param age 年齢
 */
export function getDaiunByAge(daiunList: Daiun[], age: number): Daiun | null {
  return daiunList.find(daiun => age >= daiun.startAge && age <= daiun.endAge) || null;
}
