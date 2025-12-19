'use client';

import { FullMeishiki, Daiun } from '@/types';
import { ELEMENT_NAMES, ELEMENT_COLORS } from '@/lib/constants/elements';
import { HEAVENLY_STEMS } from '@/lib/constants/stems';

interface DaiunDisplayProps {
  meishiki: FullMeishiki;
}

export default function DaiunDisplay({ meishiki }: DaiunDisplayProps) {
  const currentAge = new Date().getFullYear() - meishiki.birthData.year;

  const getCurrentDaiun = (): Daiun | null => {
    return meishiki.daiun.find(d => currentAge >= d.startAge && currentAge <= d.endAge) || null;
  };

  const currentDaiun = getCurrentDaiun();

  return (
    <div className="card animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-center">大運</h2>

      {/* 現在の大運 */}
      {currentDaiun && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-indigo-200">
          <div className="text-sm text-gray-500 mb-1">現在の大運（{currentDaiun.startAge}〜{currentDaiun.endAge}歳）</div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold"
              style={{ color: ELEMENT_COLORS[ELEMENT_NAMES[HEAVENLY_STEMS[currentDaiun.pillar.stemIndex].element]] }}>
              {currentDaiun.pillar.stem}{currentDaiun.pillar.branch}
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white rounded text-sm font-medium">
                {currentDaiun.tsuhensei}
              </span>
              <span className="px-2 py-1 bg-white rounded text-sm font-medium text-purple-600">
                {currentDaiun.juniUnsei}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 大運一覧 */}
      <div className="overflow-x-auto">
        <table className="fortune-table">
          <thead>
            <tr>
              <th>年齢</th>
              <th>大運</th>
              <th>通変星</th>
              <th>十二運</th>
            </tr>
          </thead>
          <tbody>
            {meishiki.daiun.map((daiun, idx) => {
              const isCurrent = currentAge >= daiun.startAge && currentAge <= daiun.endAge;
              const stemColor = ELEMENT_COLORS[ELEMENT_NAMES[HEAVENLY_STEMS[daiun.pillar.stemIndex].element]];

              return (
                <tr key={idx} className={`timeline-row ${isCurrent ? 'current' : ''}`}>
                  <td className="font-medium">
                    {daiun.startAge}〜{daiun.endAge}歳
                  </td>
                  <td>
                    <span className="text-xl font-bold" style={{ color: stemColor }}>
                      {daiun.pillar.stem}{daiun.pillar.branch}
                    </span>
                  </td>
                  <td>
                    <span className="tsuhensei-badge bg-gray-100">
                      {daiun.tsuhensei}
                    </span>
                  </td>
                  <td className="text-purple-600 font-medium">
                    {daiun.juniUnsei}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
