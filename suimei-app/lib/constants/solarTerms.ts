// 二十四節気の定義

// 節気（月柱の切り替えに使用するもの）
export const JIE_TERMS = [
  { index: 0, name: '立春', longitude: 315, monthBranch: 2 },  // 寅月
  { index: 2, name: '啓蟄', longitude: 345, monthBranch: 3 },  // 卯月
  { index: 4, name: '清明', longitude: 15, monthBranch: 4 },   // 辰月
  { index: 6, name: '立夏', longitude: 45, monthBranch: 5 },   // 巳月
  { index: 8, name: '芒種', longitude: 75, monthBranch: 6 },   // 午月
  { index: 10, name: '小暑', longitude: 105, monthBranch: 7 }, // 未月
  { index: 12, name: '立秋', longitude: 135, monthBranch: 8 }, // 申月
  { index: 14, name: '白露', longitude: 165, monthBranch: 9 }, // 酉月
  { index: 16, name: '寒露', longitude: 195, monthBranch: 10 }, // 戌月
  { index: 18, name: '立冬', longitude: 225, monthBranch: 11 }, // 亥月
  { index: 20, name: '大雪', longitude: 255, monthBranch: 0 },  // 子月
  { index: 22, name: '小寒', longitude: 285, monthBranch: 1 },  // 丑月
];

// 二十四節気全体
export const SOLAR_TERMS = [
  { index: 0, name: '立春', longitude: 315, isJie: true },
  { index: 1, name: '雨水', longitude: 330, isJie: false },
  { index: 2, name: '啓蟄', longitude: 345, isJie: true },
  { index: 3, name: '春分', longitude: 0, isJie: false },
  { index: 4, name: '清明', longitude: 15, isJie: true },
  { index: 5, name: '穀雨', longitude: 30, isJie: false },
  { index: 6, name: '立夏', longitude: 45, isJie: true },
  { index: 7, name: '小満', longitude: 60, isJie: false },
  { index: 8, name: '芒種', longitude: 75, isJie: true },
  { index: 9, name: '夏至', longitude: 90, isJie: false },
  { index: 10, name: '小暑', longitude: 105, isJie: true },
  { index: 11, name: '大暑', longitude: 120, isJie: false },
  { index: 12, name: '立秋', longitude: 135, isJie: true },
  { index: 13, name: '処暑', longitude: 150, isJie: false },
  { index: 14, name: '白露', longitude: 165, isJie: true },
  { index: 15, name: '秋分', longitude: 180, isJie: false },
  { index: 16, name: '寒露', longitude: 195, isJie: true },
  { index: 17, name: '霜降', longitude: 210, isJie: false },
  { index: 18, name: '立冬', longitude: 225, isJie: true },
  { index: 19, name: '小雪', longitude: 240, isJie: false },
  { index: 20, name: '大雪', longitude: 255, isJie: true },
  { index: 21, name: '冬至', longitude: 270, isJie: false },
  { index: 22, name: '小寒', longitude: 285, isJie: true },
  { index: 23, name: '大寒', longitude: 300, isJie: false },
];

// 月支を取得するための節気名マップ
export const JIE_TO_MONTH_BRANCH: Record<string, number> = {
  '立春': 2, '啓蟄': 3, '清明': 4, '立夏': 5,
  '芒種': 6, '小暑': 7, '立秋': 8, '白露': 9,
  '寒露': 10, '立冬': 11, '大雪': 0, '小寒': 1,
};

// 節気のおおよその日付（あくまで参考値、実際はlunar-javascriptで計算）
export const APPROXIMATE_JIE_DATES: Record<string, { month: number; day: number }> = {
  '立春': { month: 2, day: 4 },
  '啓蟄': { month: 3, day: 5 },
  '清明': { month: 4, day: 5 },
  '立夏': { month: 5, day: 6 },
  '芒種': { month: 6, day: 6 },
  '小暑': { month: 7, day: 7 },
  '立秋': { month: 8, day: 7 },
  '白露': { month: 9, day: 8 },
  '寒露': { month: 10, day: 8 },
  '立冬': { month: 11, day: 7 },
  '大雪': { month: 12, day: 7 },
  '小寒': { month: 1, day: 6 },
};
