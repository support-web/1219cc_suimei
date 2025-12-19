// 通変星（十神）計算ロジック

import { TsuhenSei, Element } from '@/types';
import { getStemElement, getStemPolarity } from '../constants/stems';

/**
 * 日干から対象天干への通変星を計算
 * @param nikkanIndex 日干インデックス
 * @param targetIndex 対象天干インデックス
 */
export function getTsuhensei(nikkanIndex: number, targetIndex: number): TsuhenSei {
  const nikkanElement = getStemElement(nikkanIndex);
  const targetElement = getStemElement(targetIndex);
  const samePolarity = getStemPolarity(nikkanIndex) === getStemPolarity(targetIndex);

  // 同じ五行
  if (nikkanElement === targetElement) {
    return samePolarity ? '比肩' : '劫財';
  }

  // 日干が生じる（食傷）
  if ((nikkanElement + 1) % 5 === targetElement) {
    return samePolarity ? '食神' : '傷官';
  }

  // 日干が剋す（財）
  if ((nikkanElement + 2) % 5 === targetElement) {
    return samePolarity ? '偏財' : '正財';
  }

  // 日干が剋される（官殺）
  if ((targetElement + 2) % 5 === nikkanElement) {
    return samePolarity ? '偏官' : '正官';
  }

  // 日干が生じられる（印）
  if ((targetElement + 1) % 5 === nikkanElement) {
    return samePolarity ? '偏印' : '印綬';
  }

  // ここには到達しないはずだが、念のため
  return '比肩';
}

// 通変星対応表（10×10マトリクス）- 高速参照用
export const TSUHENSEI_TABLE: Record<string, Record<string, TsuhenSei>> = {
  '甲': { '甲': '比肩', '乙': '劫財', '丙': '食神', '丁': '傷官', '戊': '偏財', '己': '正財', '庚': '偏官', '辛': '正官', '壬': '偏印', '癸': '印綬' },
  '乙': { '甲': '劫財', '乙': '比肩', '丙': '傷官', '丁': '食神', '戊': '正財', '己': '偏財', '庚': '正官', '辛': '偏官', '壬': '印綬', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '印綬', '丙': '比肩', '丁': '劫財', '戊': '食神', '己': '傷官', '庚': '偏財', '辛': '正財', '壬': '偏官', '癸': '正官' },
  '丁': { '甲': '印綬', '乙': '偏印', '丙': '劫財', '丁': '比肩', '戊': '傷官', '己': '食神', '庚': '正財', '辛': '偏財', '壬': '正官', '癸': '偏官' },
  '戊': { '甲': '偏官', '乙': '正官', '丙': '偏印', '丁': '印綬', '戊': '比肩', '己': '劫財', '庚': '食神', '辛': '傷官', '壬': '偏財', '癸': '正財' },
  '己': { '甲': '正官', '乙': '偏官', '丙': '印綬', '丁': '偏印', '戊': '劫財', '己': '比肩', '庚': '傷官', '辛': '食神', '壬': '正財', '癸': '偏財' },
  '庚': { '甲': '偏財', '乙': '正財', '丙': '偏官', '丁': '正官', '戊': '偏印', '己': '印綬', '庚': '比肩', '辛': '劫財', '壬': '食神', '癸': '傷官' },
  '辛': { '甲': '正財', '乙': '偏財', '丙': '正官', '丁': '偏官', '戊': '印綬', '己': '偏印', '庚': '劫財', '辛': '比肩', '壬': '傷官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '傷官', '丙': '偏財', '丁': '正財', '戊': '偏官', '己': '正官', '庚': '偏印', '辛': '印綬', '壬': '比肩', '癸': '劫財' },
  '癸': { '甲': '傷官', '乙': '食神', '丙': '正財', '丁': '偏財', '戊': '正官', '己': '偏官', '庚': '印綬', '辛': '偏印', '壬': '劫財', '癸': '比肩' },
};

/**
 * テーブル参照による高速な通変星取得
 * @param nikkanKanji 日干の漢字
 * @param targetKanji 対象天干の漢字
 */
export function getTsuhenseiByKanji(nikkanKanji: string, targetKanji: string): TsuhenSei {
  return TSUHENSEI_TABLE[nikkanKanji][targetKanji];
}

// 通変星のカテゴリ分類
export const TSUHENSEI_CATEGORIES = {
  比劫: ['比肩', '劫財'] as TsuhenSei[],
  食傷: ['食神', '傷官'] as TsuhenSei[],
  財星: ['偏財', '正財'] as TsuhenSei[],
  官殺: ['偏官', '正官'] as TsuhenSei[],
  印星: ['偏印', '印綬'] as TsuhenSei[],
};

// 通変星の読み方
export const TSUHENSEI_READINGS: Record<TsuhenSei, string> = {
  '比肩': 'ひけん',
  '劫財': 'ごうざい',
  '食神': 'しょくしん',
  '傷官': 'しょうかん',
  '偏財': 'へんざい',
  '正財': 'せいざい',
  '偏官': 'へんかん',
  '正官': 'せいかん',
  '偏印': 'へんいん',
  '印綬': 'いんじゅ',
};

// 通変星の簡易説明
export const TSUHENSEI_DESCRIPTIONS: Record<TsuhenSei, string> = {
  '比肩': '同等の存在、競争相手、自立心',
  '劫財': '強力なライバル、奪う力、行動力',
  '食神': '才能の発揮、表現力、楽観性',
  '傷官': '鋭い感性、批判力、芸術性',
  '偏財': '流動的な財、投資、社交性',
  '正財': '安定した収入、堅実、誠実',
  '偏官': '権威への挑戦、冒険心、行動力',
  '正官': '責任感、規律、社会的地位',
  '偏印': '直感、霊感、学問への興味',
  '印綬': '知性、学習能力、保護を受ける',
};
