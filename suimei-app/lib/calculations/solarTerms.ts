// 節気計算ロジック

import { JIE_TERMS } from '../constants/solarTerms';

// lunar-javascriptを使用した節気判定
// 注意: このファイルはサーバーサイドで実行されることを想定

/**
 * 指定日時の月支インデックスを取得
 * lunar-javascriptを使用して節入り日時を判定
 */
export async function getMonthBranchFromDate(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): Promise<{ monthBranch: number; effectiveYear: number }> {
  // Dynamic importでlunar-javascriptを読み込み
  const { Solar } = await import('lunar-javascript');

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  // 年干支と月干支を取得
  const yearGanZhi = bazi.getYear();
  const monthGanZhi = bazi.getMonth();

  // 月支を抽出（2文字目）
  const monthBranchChar = monthGanZhi.charAt(1);
  const branchChars = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const monthBranch = branchChars.indexOf(monthBranchChar);

  // 年干を抽出して有効年を判定
  const yearGanChar = yearGanZhi.charAt(0);
  const stemChars = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const yearStemIndex = stemChars.indexOf(yearGanChar);

  // 年干から有効年を逆算
  // (year - 4) % 10 === yearStemIndex となる年を求める
  let effectiveYear = year;
  if (((year - 4) % 10 + 10) % 10 !== yearStemIndex) {
    effectiveYear = year - 1;
  }

  return { monthBranch, effectiveYear };
}

/**
 * 指定年の立春日時を取得
 */
export async function getLichunDate(year: number): Promise<Date> {
  const { Solar } = await import('lunar-javascript');

  // その年の2月付近で立春を探す
  const solar = Solar.fromYmd(year, 2, 1);
  const jieQi = solar.getJieQiTable();

  // 立春の日時を取得
  const lichun = jieQi['立春'];
  if (lichun) {
    return lichun.toDate();
  }

  // フォールバック: おおよその日時
  return new Date(year, 1, 4, 0, 0, 0);
}

/**
 * 次の節入り日時を取得
 */
export async function getNextJieDate(
  year: number,
  month: number,
  day: number
): Promise<{ name: string; date: Date; monthBranch: number }> {
  const { Solar } = await import('lunar-javascript');

  const solar = Solar.fromYmd(year, month, day);
  const jieQi = solar.getNextJie();

  if (jieQi) {
    const jieName = jieQi.getName();
    const jieDate = jieQi.getSolar().toDate();

    // 月支を取得
    const term = JIE_TERMS.find(t => t.name === jieName);
    const monthBranch = term ? term.monthBranch : 0;

    return { name: jieName, date: jieDate, monthBranch };
  }

  throw new Error('次の節気が見つかりません');
}

/**
 * 前の節入り日時を取得
 */
export async function getPrevJieDate(
  year: number,
  month: number,
  day: number
): Promise<{ name: string; date: Date; monthBranch: number }> {
  const { Solar } = await import('lunar-javascript');

  const solar = Solar.fromYmd(year, month, day);
  const jieQi = solar.getPrevJie();

  if (jieQi) {
    const jieName = jieQi.getName();
    const jieDate = jieQi.getSolar().toDate();

    // 月支を取得
    const term = JIE_TERMS.find(t => t.name === jieName);
    const monthBranch = term ? term.monthBranch : 0;

    return { name: jieName, date: jieDate, monthBranch };
  }

  throw new Error('前の節気が見つかりません');
}

/**
 * lunar-javascriptを使用して四柱を直接取得
 */
export async function getBaziFromLunarJs(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0
): Promise<{
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar: { stem: string; branch: string };
}> {
  const { Solar } = await import('lunar-javascript');

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  const parseGanZhi = (gz: string) => ({
    stem: gz.charAt(0),
    branch: gz.charAt(1),
  });

  return {
    yearPillar: parseGanZhi(bazi.getYear()),
    monthPillar: parseGanZhi(bazi.getMonth()),
    dayPillar: parseGanZhi(bazi.getDay()),
    hourPillar: parseGanZhi(bazi.getTime()),
  };
}
