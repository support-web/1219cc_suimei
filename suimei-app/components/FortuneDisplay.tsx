'use client';

import { FullMeishiki, FortuneTimeline } from '@/types';
import { generateFortuneTimeline } from '@/lib/suimei';
import { getFortuneLevel, getFortuneColor } from '@/lib/calculations/fortune';
import { ELEMENT_NAMES, ELEMENT_COLORS } from '@/lib/constants/elements';
import { HEAVENLY_STEMS } from '@/lib/constants/stems';

interface FortuneDisplayProps {
  meishiki: FullMeishiki;
}

export default function FortuneDisplay({ meishiki }: FortuneDisplayProps) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;
  const endYear = currentYear + 10;

  const timeline = generateFortuneTimeline(meishiki, startYear, endYear);

  const ScoreBar = ({ score, label }: { score: number; label: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-12">{label}</span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="fortune-bar"
          style={{
            width: `${score}%`,
            backgroundColor: getFortuneColor(score),
          }}
        />
      </div>
      <span className="text-xs font-medium w-8">{score}</span>
    </div>
  );

  return (
    <div className="card animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-center">運勢年表</h2>

      {/* 今年のハイライト */}
      {timeline.find(t => t.year === currentYear) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-sm text-gray-500 mb-2">今年の運勢（{currentYear}年）</div>
          {(() => {
            const current = timeline.find(t => t.year === currentYear)!;
            const level = getFortuneLevel(current.scores.overall);
            const color = getFortuneColor(current.scores.overall);

            return (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold" style={{ color }}>
                    {level}
                  </div>
                  <div className="text-2xl font-bold">
                    {current.ryunen.pillar.stem}{current.ryunen.pillar.branch}年
                  </div>
                  <div className="text-sm text-gray-500">
                    （{current.age}歳）
                  </div>
                </div>
                <div className="space-y-2">
                  <ScoreBar score={current.scores.overall} label="総合運" />
                  <ScoreBar score={current.scores.money} label="金運" />
                  <ScoreBar score={current.scores.love} label="恋愛運" />
                  <ScoreBar score={current.scores.work} label="仕事運" />
                  <ScoreBar score={current.scores.health} label="健康運" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 運勢グラフ（シンプルな棒グラフ） */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">総合運推移</h3>
        <div className="flex items-end gap-1 h-32 bg-gray-50 rounded-lg p-2">
          {timeline.map((t, idx) => {
            const isCurrentYear = t.year === currentYear;
            const color = getFortuneColor(t.scores.overall);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t transition-all hover:opacity-80 ${isCurrentYear ? 'ring-2 ring-indigo-500' : ''}`}
                  style={{
                    height: `${t.scores.overall}%`,
                    backgroundColor: color,
                  }}
                  title={`${t.year}年: ${t.scores.overall}点`}
                />
                <div className={`text-xs mt-1 ${isCurrentYear ? 'font-bold' : 'text-gray-400'}`}>
                  {t.year.toString().slice(-2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 年表テーブル */}
      <div className="overflow-x-auto">
        <table className="fortune-table text-sm">
          <thead>
            <tr>
              <th>年</th>
              <th>年齢</th>
              <th>流年</th>
              <th>大運</th>
              <th>総合</th>
              <th>金運</th>
              <th>恋愛</th>
              <th>仕事</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((t, idx) => {
              const isCurrentYear = t.year === currentYear;
              const ryunenColor = ELEMENT_COLORS[ELEMENT_NAMES[HEAVENLY_STEMS[t.ryunen.pillar.stemIndex].element]];

              return (
                <tr key={idx} className={`timeline-row ${isCurrentYear ? 'current font-semibold' : ''}`}>
                  <td>{t.year}</td>
                  <td>{t.age}歳</td>
                  <td style={{ color: ryunenColor }}>
                    {t.ryunen.pillar.stem}{t.ryunen.pillar.branch}
                  </td>
                  <td className="text-xs">
                    {t.daiun.pillar.stem}{t.daiun.pillar.branch}
                    <br />
                    <span className="text-gray-400">{t.daiun.period}</span>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-white text-xs"
                      style={{ backgroundColor: getFortuneColor(t.scores.overall) }}>
                      {t.scores.overall}
                    </span>
                  </td>
                  <td>{t.scores.money}</td>
                  <td>{t.scores.love}</td>
                  <td>{t.scores.work}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
