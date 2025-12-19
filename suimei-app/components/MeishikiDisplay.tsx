'use client';

import { FullMeishiki } from '@/types';
import PillarDisplay from './PillarDisplay';
import { ELEMENT_NAMES, ELEMENT_COLORS } from '@/lib/constants/elements';
import { HEAVENLY_STEMS } from '@/lib/constants/stems';

interface MeishikiDisplayProps {
  meishiki: FullMeishiki;
}

export default function MeishikiDisplay({ meishiki }: MeishikiDisplayProps) {
  const dayStem = HEAVENLY_STEMS[meishiki.dayPillar.stemIndex];
  const dayMasterElement = ELEMENT_NAMES[dayStem.element];
  const dayMasterColor = ELEMENT_COLORS[dayMasterElement];

  return (
    <div className="card animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-center">命式</h2>

      {/* 日主情報 */}
      <div className="text-center mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div className="text-sm text-gray-500">日主（にっしゅ）</div>
        <div className="text-4xl font-bold my-2" style={{ color: dayMasterColor }}>
          {meishiki.dayPillar.stem}
        </div>
        <div className="text-sm">
          {dayStem.reading}（{dayMasterElement}の{dayStem.polarity === 0 ? '陽' : '陰'}）
        </div>
        <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: meishiki.dayMasterStrength === 'strong' ? '#E8F5E9' : '#FFF3E0',
            color: meishiki.dayMasterStrength === 'strong' ? '#2E7D32' : '#E65100',
          }}>
          {meishiki.dayMasterStrength === 'strong' ? '身強' : '身弱'}
        </div>
      </div>

      {/* 四柱表示 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <PillarDisplay
          label="時柱"
          pillar={meishiki.hourPillar || meishiki.dayPillar}
          tsuhensei={meishiki.tsuhensei.hour}
          juniUnsei={meishiki.juniUnsei.hour}
          zokanTsuhensei={meishiki.zokanTsuhensei.hour || undefined}
        />
        <PillarDisplay
          label="日柱"
          pillar={meishiki.dayPillar}
          juniUnsei={meishiki.juniUnsei.day}
          zokanTsuhensei={meishiki.zokanTsuhensei.day}
          isDay
        />
        <PillarDisplay
          label="月柱"
          pillar={meishiki.monthPillar}
          tsuhensei={meishiki.tsuhensei.month}
          juniUnsei={meishiki.juniUnsei.month}
          zokanTsuhensei={meishiki.zokanTsuhensei.month}
        />
        <PillarDisplay
          label="年柱"
          pillar={meishiki.yearPillar}
          tsuhensei={meishiki.tsuhensei.year}
          juniUnsei={meishiki.juniUnsei.year}
          zokanTsuhensei={meishiki.zokanTsuhensei.year}
        />
      </div>

      {/* 喜神・忌神 */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-700 mb-2">喜神（きしん）</h3>
          <p className="text-sm text-gray-600 mb-2">あなたにとって良い影響を与える星</p>
          <div className="flex flex-wrap gap-2">
            {meishiki.kishinGishin.kishin.map((ts, idx) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {ts}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold text-red-700 mb-2">忌神（きしん）</h3>
          <p className="text-sm text-gray-600 mb-2">注意が必要な星</p>
          <div className="flex flex-wrap gap-2">
            {meishiki.kishinGishin.gishin.map((ts, idx) => (
              <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                {ts}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 大運情報 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">大運情報</h3>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-gray-500">大運開始年齢：</span>
            {meishiki.ritsunAge.years}歳{meishiki.ritsunAge.months > 0 && `${meishiki.ritsunAge.months}ヶ月`}
          </p>
          <p>
            <span className="text-gray-500">大運方向：</span>
            {meishiki.daiunDirection === 'forward' ? '順行' : '逆行'}
          </p>
        </div>
      </div>
    </div>
  );
}
