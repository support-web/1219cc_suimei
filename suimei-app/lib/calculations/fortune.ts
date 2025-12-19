// 運勢判定ロジック

import {
  Pillar,
  TsuhenSei,
  DayMasterStrength,
  KishinGishin,
  FortuneScore,
  Element,
} from '@/types';
import { getStemElement } from '../constants/stems';
import { BRANCH_ELEMENTS } from '../constants/branches';
import { getTsuhensei, TSUHENSEI_CATEGORIES } from './tsuhensei';
import { hasChong, hasShigo } from './ryunen';

/**
 * 日主の強弱（身強・身弱）を判定
 * @param dayStemIndex 日干インデックス
 * @param monthBranchIndex 月支インデックス
 * @param pillars 四柱の天干インデックス配列
 */
export function determineDayMasterStrength(
  dayStemIndex: number,
  monthBranchIndex: number,
  pillars: { stemIndex: number; branchIndex: number }[]
): DayMasterStrength {
  const dayElement = getStemElement(dayStemIndex);
  const monthElement = BRANCH_ELEMENTS[monthBranchIndex];

  // 月令が日主を助けるか
  // 同じ五行または日主を生じる五行なら支援
  const monthSupports =
    monthElement === dayElement ||
    (monthElement + 1) % 5 === dayElement;

  // 四柱の各天干が日主を助けるか剋すかをカウント
  let supportCount = 0;
  let exhaustCount = 0;

  pillars.forEach(pillar => {
    const element = getStemElement(pillar.stemIndex);
    // 同じ五行（比劫）または日主を生じる五行（印星）をカウント
    if (element === dayElement || (element + 1) % 5 === dayElement) {
      supportCount++;
    } else {
      exhaustCount++;
    }
  });

  // 地支の蔵干も考慮（簡易版）
  pillars.forEach(pillar => {
    const branchElement = BRANCH_ELEMENTS[pillar.branchIndex];
    if (branchElement === dayElement || (branchElement + 1) % 5 === dayElement) {
      supportCount += 0.5;
    } else {
      exhaustCount += 0.5;
    }
  });

  // 月令の支援 + 比劫印星の数で判定
  if (monthSupports && supportCount >= exhaustCount) {
    return 'strong'; // 身強
  }

  return 'weak'; // 身弱
}

/**
 * 喜神・忌神を判定
 * @param strength 身強・身弱
 */
export function determineKishinGishin(strength: DayMasterStrength): KishinGishin {
  if (strength === 'strong') {
    // 身強：日主を弱める星が喜神
    return {
      kishin: ['食神', '傷官', '偏財', '正財', '偏官', '正官'],
      gishin: ['比肩', '劫財', '偏印', '印綬'],
    };
  } else {
    // 身弱：日主を助ける星が喜神
    return {
      kishin: ['比肩', '劫財', '偏印', '印綬'],
      gishin: ['食神', '傷官', '偏財', '正財', '偏官', '正官'],
    };
  }
}

/**
 * 運勢スコアを計算
 * @param dayStemIndex 日干インデックス
 * @param dayBranchIndex 日支インデックス
 * @param kishinGishin 喜神・忌神
 * @param daiunPillar 大運柱
 * @param ryunenPillar 流年柱
 */
export function calculateFortuneScore(
  dayStemIndex: number,
  dayBranchIndex: number,
  kishinGishin: KishinGishin,
  daiunPillar: Pillar,
  ryunenPillar: Pillar
): FortuneScore {
  const { kishin, gishin } = kishinGishin;

  // 大運の通変星
  const daiunTsuhen = getTsuhensei(dayStemIndex, daiunPillar.stemIndex);
  // 流年の通変星
  const ryunenTsuhen = getTsuhensei(dayStemIndex, ryunenPillar.stemIndex);

  let overall = 50; // 基準値

  // 大運評価（重み: 60%）
  if (kishin.includes(daiunTsuhen)) overall += 20;
  if (gishin.includes(daiunTsuhen)) overall -= 20;

  // 流年評価（重み: 40%）
  if (kishin.includes(ryunenTsuhen)) overall += 15;
  if (gishin.includes(ryunenTsuhen)) overall -= 15;

  // 冲のチェック
  if (hasChong(dayBranchIndex, ryunenPillar.branchIndex)) {
    overall -= 10;
  }

  // 支合のチェック
  if (hasShigo(dayBranchIndex, ryunenPillar.branchIndex)) {
    overall += 5;
  }

  // 個別運勢
  const money = calculateMoneyFortune(dayStemIndex, kishinGishin, ryunenTsuhen);
  const love = calculateLoveFortune(dayStemIndex, kishinGishin, ryunenTsuhen);
  const work = calculateWorkFortune(dayStemIndex, kishinGishin, ryunenTsuhen);
  const health = calculateHealthFortune(dayStemIndex, kishinGishin, ryunenTsuhen);

  return {
    overall: Math.max(0, Math.min(100, overall)),
    money,
    love,
    work,
    health,
  };
}

/**
 * 金運を計算
 */
function calculateMoneyFortune(
  dayStemIndex: number,
  kishinGishin: KishinGishin,
  ryunenTsuhen: TsuhenSei
): number {
  let score = 50;

  // 財星の年は金運上昇
  if (TSUHENSEI_CATEGORIES.財星.includes(ryunenTsuhen)) score += 25;

  // 食傷星は財を生む
  if (TSUHENSEI_CATEGORIES.食傷.includes(ryunenTsuhen)) score += 10;

  // 比劫星は財を奪う
  if (TSUHENSEI_CATEGORIES.比劫.includes(ryunenTsuhen)) score -= 15;

  // 印星は財を剋す
  if (TSUHENSEI_CATEGORIES.印星.includes(ryunenTsuhen)) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * 恋愛運を計算
 */
function calculateLoveFortune(
  dayStemIndex: number,
  kishinGishin: KishinGishin,
  ryunenTsuhen: TsuhenSei
): number {
  let score = 50;
  const dayPolarity = dayStemIndex % 2;

  // 正財・正官は正縁（結婚に良い）
  if (ryunenTsuhen === '正財' || ryunenTsuhen === '正官') score += 20;

  // 偏財・偏官は偏縁（恋愛に良いが不安定）
  if (ryunenTsuhen === '偏財' || ryunenTsuhen === '偏官') score += 10;

  // 比劫は競争相手
  if (TSUHENSEI_CATEGORIES.比劫.includes(ryunenTsuhen)) score -= 10;

  // 傷官は男性にとって妻星を傷つける
  if (dayPolarity === 0 && ryunenTsuhen === '傷官') score -= 15;

  return Math.max(0, Math.min(100, score));
}

/**
 * 仕事運を計算
 */
function calculateWorkFortune(
  dayStemIndex: number,
  kishinGishin: KishinGishin,
  ryunenTsuhen: TsuhenSei
): number {
  let score = 50;

  // 官星は仕事・地位
  if (TSUHENSEI_CATEGORIES.官殺.includes(ryunenTsuhen)) score += 20;

  // 印星は学習・資格
  if (TSUHENSEI_CATEGORIES.印星.includes(ryunenTsuhen)) score += 15;

  // 食傷は才能発揮
  if (TSUHENSEI_CATEGORIES.食傷.includes(ryunenTsuhen)) score += 10;

  // 財星は商売・副業
  if (TSUHENSEI_CATEGORIES.財星.includes(ryunenTsuhen)) score += 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * 健康運を計算
 */
function calculateHealthFortune(
  dayStemIndex: number,
  kishinGishin: KishinGishin,
  ryunenTsuhen: TsuhenSei
): number {
  let score = 60; // 健康は基本高め

  // 比劫・印星は自分を助ける
  if (TSUHENSEI_CATEGORIES.比劫.includes(ryunenTsuhen)) score += 10;
  if (TSUHENSEI_CATEGORIES.印星.includes(ryunenTsuhen)) score += 10;

  // 官殺は消耗
  if (TSUHENSEI_CATEGORIES.官殺.includes(ryunenTsuhen)) score -= 15;

  // 食傷は気力消耗
  if (TSUHENSEI_CATEGORIES.食傷.includes(ryunenTsuhen)) score -= 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * 運勢レベルを文字列で取得
 */
export function getFortuneLevel(score: number): string {
  if (score >= 80) return '大吉';
  if (score >= 65) return '吉';
  if (score >= 50) return '中吉';
  if (score >= 35) return '小吉';
  if (score >= 20) return '凶';
  return '大凶';
}

/**
 * 運勢の色を取得
 */
export function getFortuneColor(score: number): string {
  if (score >= 80) return '#FF4081';  // ピンク（大吉）
  if (score >= 65) return '#4CAF50';  // 緑（吉）
  if (score >= 50) return '#2196F3';  // 青（中吉）
  if (score >= 35) return '#FFC107';  // 黄（小吉）
  if (score >= 20) return '#FF9800';  // オレンジ（凶）
  return '#F44336';  // 赤（大凶）
}
