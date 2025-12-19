'use client';

import { Pillar, TsuhenSei, JuniUnSei } from '@/types';
import { HEAVENLY_STEMS } from '@/lib/constants/stems';
import { EARTHLY_BRANCHES } from '@/lib/constants/branches';
import { ELEMENT_NAMES, ELEMENT_COLORS } from '@/lib/constants/elements';

interface PillarDisplayProps {
  label: string;
  pillar: Pillar;
  tsuhensei?: TsuhenSei | null;
  juniUnsei?: JuniUnSei | null;
  zokanTsuhensei?: TsuhenSei[];
  isDay?: boolean;
}

export default function PillarDisplay({
  label,
  pillar,
  tsuhensei,
  juniUnsei,
  zokanTsuhensei,
  isDay = false,
}: PillarDisplayProps) {
  const stem = HEAVENLY_STEMS[pillar.stemIndex];
  const branch = EARTHLY_BRANCHES[pillar.branchIndex];

  const stemColor = ELEMENT_COLORS[ELEMENT_NAMES[stem.element]];
  const branchColor = ELEMENT_COLORS[ELEMENT_NAMES[branch.element]];

  return (
    <div className={`pillar ${isDay ? 'ring-2 ring-indigo-500' : ''}`}>
      {/* ラベル */}
      <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>

      {/* 通変星 */}
      {tsuhensei && (
        <div className="tsuhensei-badge bg-gray-100 text-gray-700 mb-2">
          {tsuhensei}
        </div>
      )}

      {/* 天干 */}
      <div
        className="pillar-stem"
        style={{ color: stemColor }}
        title={`${stem.reading} (${ELEMENT_NAMES[stem.element]})`}
      >
        {pillar.stem}
      </div>

      {/* 五行表示 */}
      <div className="text-xs text-gray-500 mb-1">
        {ELEMENT_NAMES[stem.element]}・{stem.polarity === 0 ? '陽' : '陰'}
      </div>

      {/* 地支 */}
      <div
        className="pillar-branch"
        style={{ color: branchColor }}
        title={`${branch.reading} (${ELEMENT_NAMES[branch.element]})`}
      >
        {pillar.branch}
      </div>

      {/* 五行表示 */}
      <div className="text-xs text-gray-500 mb-2">
        {ELEMENT_NAMES[branch.element]}・{branch.polarity === 0 ? '陽' : '陰'}
      </div>

      {/* 十二運星 */}
      {juniUnsei && (
        <div className="text-sm font-medium text-purple-600 mt-1">
          {juniUnsei}
        </div>
      )}

      {/* 蔵干通変星 */}
      {zokanTsuhensei && zokanTsuhensei.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">蔵干</div>
          <div className="flex flex-wrap gap-1 mt-1 justify-center">
            {zokanTsuhensei.map((ts, idx) => (
              <span key={idx} className="text-xs px-1 py-0.5 bg-gray-100 rounded">
                {ts}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
