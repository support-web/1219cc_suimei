// 四柱推命メイン計算モジュール

import {
  BirthData,
  Meishiki,
  FullMeishiki,
  Pillar,
  TsuhenSei,
  JuniUnSei,
  Daiun,
  FortuneTimeline,
} from '@/types';
import { STEM_KANJI, getStemIndex } from './constants/stems';
import { BRANCH_KANJI, getBranchIndex, EARTHLY_BRANCHES } from './constants/branches';
import { getBaziFromLunarJs, getNextJieDate, getPrevJieDate } from './calculations/solarTerms';
import { getTsuhensei, getTsuhenseiByKanji } from './calculations/tsuhensei';
import { getJuniUnsei, getJuniUnseiByKanji } from './calculations/juniunsei';
import {
  getDaiunDirection,
  calculateRitsunAge,
  generateDaiunList,
  getDaiunByAge,
} from './calculations/daiun';
import { getRyunenPillar, calculateRyunen } from './calculations/ryunen';
import {
  determineDayMasterStrength,
  determineKishinGishin,
  calculateFortuneScore,
} from './calculations/fortune';

/**
 * 命式を計算
 * @param birthData 生年月日時データ
 */
export async function calculateMeishiki(birthData: BirthData): Promise<FullMeishiki> {
  const { year, month, day, hour, minute, gender } = birthData;

  // lunar-javascriptで四柱を取得
  const bazi = await getBaziFromLunarJs(
    year,
    month,
    day,
    hour ?? 12,
    minute ?? 0
  );

  // Pillar オブジェクトに変換
  const yearPillar = createPillar(bazi.yearPillar.stem, bazi.yearPillar.branch);
  const monthPillar = createPillar(bazi.monthPillar.stem, bazi.monthPillar.branch);
  const dayPillar = createPillar(bazi.dayPillar.stem, bazi.dayPillar.branch);
  const hourPillar = hour !== null
    ? createPillar(bazi.hourPillar.stem, bazi.hourPillar.branch)
    : null;

  // 通変星を計算
  const tsuhensei = {
    year: getTsuhenseiByKanji(dayPillar.stem, yearPillar.stem),
    month: getTsuhenseiByKanji(dayPillar.stem, monthPillar.stem),
    hour: hourPillar ? getTsuhenseiByKanji(dayPillar.stem, hourPillar.stem) : null,
  };

  // 十二運星を計算
  const juniUnsei = {
    year: getJuniUnseiByKanji(dayPillar.stem, yearPillar.branch),
    month: getJuniUnseiByKanji(dayPillar.stem, monthPillar.branch),
    day: getJuniUnseiByKanji(dayPillar.stem, dayPillar.branch),
    hour: hourPillar ? getJuniUnseiByKanji(dayPillar.stem, hourPillar.branch) : null,
  };

  // 蔵干通変星を計算
  const zokanTsuhensei = {
    year: calculateZokanTsuhensei(dayPillar.stemIndex, yearPillar.branchIndex),
    month: calculateZokanTsuhensei(dayPillar.stemIndex, monthPillar.branchIndex),
    day: calculateZokanTsuhensei(dayPillar.stemIndex, dayPillar.branchIndex),
    hour: hourPillar
      ? calculateZokanTsuhensei(dayPillar.stemIndex, hourPillar.branchIndex)
      : null,
  };

  // 身強・身弱を判定
  const pillars = [yearPillar, monthPillar, dayPillar];
  if (hourPillar) pillars.push(hourPillar);

  const dayMasterStrength = determineDayMasterStrength(
    dayPillar.stemIndex,
    monthPillar.branchIndex,
    pillars
  );

  // 喜神・忌神を判定
  const kishinGishin = determineKishinGishin(dayMasterStrength);

  // 大運の方向を判定
  const daiunDirection = getDaiunDirection(gender, yearPillar.stemIndex);

  // 立運年齢を計算
  const birthDate = new Date(year, month - 1, day, hour ?? 12, minute ?? 0);
  const nextJie = await getNextJieDate(year, month, day);
  const prevJie = await getPrevJieDate(year, month, day);

  const ritsunAge = calculateRitsunAge(
    birthDate,
    daiunDirection,
    nextJie.date,
    prevJie.date
  );

  // 大運リストを生成
  const daiun = generateDaiunList(
    monthPillar,
    dayPillar,
    daiunDirection,
    ritsunAge,
    10
  );

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    tsuhensei,
    juniUnsei,
    zokanTsuhensei,
    birthData,
    dayMasterStrength,
    kishinGishin,
    daiunDirection,
    ritsunAge,
    daiun,
  };
}

/**
 * Pillarオブジェクトを作成
 */
function createPillar(stem: string, branch: string): Pillar {
  return {
    stemIndex: getStemIndex(stem),
    branchIndex: getBranchIndex(branch),
    stem,
    branch,
  };
}

/**
 * 蔵干通変星を計算
 */
function calculateZokanTsuhensei(dayStemIndex: number, branchIndex: number): TsuhenSei[] {
  const branch = EARTHLY_BRANCHES[branchIndex];
  return branch.hiddenStems.map(hiddenStemIndex =>
    getTsuhensei(dayStemIndex, hiddenStemIndex)
  );
}

/**
 * 運勢タイムラインを生成
 * @param meishiki 命式
 * @param startYear 開始年
 * @param endYear 終了年
 */
export function generateFortuneTimeline(
  meishiki: FullMeishiki,
  startYear: number,
  endYear: number
): FortuneTimeline[] {
  const timeline: FortuneTimeline[] = [];
  const birthYear = meishiki.birthData.year;

  for (let year = startYear; year <= endYear; year++) {
    const age = year - birthYear;
    if (age < 0) continue;

    // 大運を取得
    const daiun = getDaiunByAge(meishiki.daiun, age);
    if (!daiun) continue;

    // 流年を計算
    const ryunenPillar = getRyunenPillar(year);

    // 運勢スコアを計算
    const scores = calculateFortuneScore(
      meishiki.dayPillar.stemIndex,
      meishiki.dayPillar.branchIndex,
      meishiki.kishinGishin,
      daiun.pillar,
      ryunenPillar
    );

    timeline.push({
      year,
      age,
      daiun: {
        pillar: daiun.pillar,
        period: `${daiun.startAge}〜${daiun.endAge}歳`,
      },
      ryunen: {
        pillar: ryunenPillar,
      },
      scores,
    });
  }

  return timeline;
}

/**
 * 今年の運勢を取得
 */
export function getCurrentYearFortune(meishiki: FullMeishiki): FortuneTimeline | null {
  const currentYear = new Date().getFullYear();
  const timeline = generateFortuneTimeline(meishiki, currentYear, currentYear);
  return timeline[0] || null;
}
