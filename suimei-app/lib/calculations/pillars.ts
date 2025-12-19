// 四柱計算ロジック

import { Pillar } from '@/types';
import { STEM_KANJI } from '../constants/stems';
import { BRANCH_KANJI, getHourBranch } from '../constants/branches';

/**
 * 年柱の計算
 * @param year 西暦年（立春後の有効年）
 */
export function getYearPillar(year: number): Pillar {
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
 * 年上起月法による月干の計算
 * @param yearStemIndex 年干インデックス
 * @param monthBranchIndex 月支インデックス（寅=2から）
 */
export function getMonthStem(yearStemIndex: number, monthBranchIndex: number): number {
  // 基準天干: 甲己年=丙(2), 乙庚年=戊(4), 丙辛年=庚(6), 丁壬年=壬(8), 戊癸年=甲(0)
  const baseStems = [2, 4, 6, 8, 0];
  const group = yearStemIndex % 5;
  const baseStem = baseStems[group];
  // 寅月(2)からの差分
  const diff = ((monthBranchIndex - 2) % 12 + 12) % 12;
  return (baseStem + diff) % 10;
}

/**
 * 月柱の計算
 * @param yearStemIndex 年干インデックス
 * @param monthBranchIndex 月支インデックス（節気で決定された値）
 */
export function getMonthPillar(yearStemIndex: number, monthBranchIndex: number): Pillar {
  const stemIndex = getMonthStem(yearStemIndex, monthBranchIndex);

  return {
    stemIndex,
    branchIndex: monthBranchIndex,
    stem: STEM_KANJI[stemIndex],
    branch: BRANCH_KANJI[monthBranchIndex],
  };
}

/**
 * ユリウス日を計算
 * @param year 西暦年
 * @param month 月（1-12）
 * @param day 日
 */
function getJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y +
             Math.floor(y / 4) - Math.floor(y / 100) +
             Math.floor(y / 400) - 32045;

  return jd;
}

/**
 * 日柱の計算
 * @param year 西暦年
 * @param month 月（1-12）
 * @param day 日
 */
export function getDayPillar(year: number, month: number, day: number): Pillar {
  const jd = getJulianDay(year, month, day);

  // 日干支番号の計算（0-59）
  const dayIndex = ((jd + 49) % 60 + 60) % 60;

  const stemIndex = dayIndex % 10;
  const branchIndex = dayIndex % 12;

  return {
    stemIndex,
    branchIndex,
    stem: STEM_KANJI[stemIndex],
    branch: BRANCH_KANJI[branchIndex],
  };
}

/**
 * 日上起時法による時干の計算
 * @param dayStemIndex 日干インデックス
 * @param hourBranchIndex 時支インデックス
 */
export function getHourStem(dayStemIndex: number, hourBranchIndex: number): number {
  // 基準時干: 甲己日=甲(0), 乙庚日=丙(2), 丙辛日=戊(4), 丁壬日=庚(6), 戊癸日=壬(8)
  const baseStems = [0, 2, 4, 6, 8];
  const group = dayStemIndex % 5;
  const baseStem = baseStems[group];
  return (baseStem + hourBranchIndex) % 10;
}

/**
 * 時柱の計算
 * @param dayStemIndex 日干インデックス
 * @param hour 時刻（0-23）
 * @param useMidnightSwitch 0時切り替え派（true）か23時切り替え派（false）か
 */
export function getHourPillar(
  dayStemIndex: number,
  hour: number,
  useMidnightSwitch: boolean = true
): Pillar {
  let effectiveDayStem = dayStemIndex;

  // 23時切り替え派の場合、23時以降は翌日の日干を使用
  if (!useMidnightSwitch && hour >= 23) {
    effectiveDayStem = (dayStemIndex + 1) % 10;
  }

  const branchIndex = getHourBranch(hour);
  const stemIndex = getHourStem(effectiveDayStem, branchIndex);

  return {
    stemIndex,
    branchIndex,
    stem: STEM_KANJI[stemIndex],
    branch: BRANCH_KANJI[branchIndex],
  };
}

/**
 * 四柱すべてを計算
 * @param year 西暦年（立春後の有効年）
 * @param month 月（1-12）
 * @param day 日
 * @param hour 時刻（0-23）、nullの場合は時柱なし
 * @param monthBranchIndex 月支インデックス（節気で決定された値）
 */
export function calculateFourPillars(
  year: number,
  month: number,
  day: number,
  hour: number | null,
  monthBranchIndex: number
): {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
} {
  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(yearPillar.stemIndex, monthBranchIndex);
  const dayPillar = getDayPillar(year, month, day);

  let hourPillar: Pillar | null = null;
  if (hour !== null) {
    hourPillar = getHourPillar(dayPillar.stemIndex, hour);
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
  };
}
